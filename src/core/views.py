from os import environ
import requests
from django.shortcuts import render
from django.http import HttpRequest, HttpResponse


def main_page(request):
    return render(request, 'main.html')


def pingpong_game(request):
    return render(request, 'pingpong.html')


def auth_42_token(request: HttpRequest):
    if request.method == "GET":
        code = request.GET.get("code")
        if not code:
            return render(request, "oauth.html", {"data": {"status": "failed"}},
                          status=400)

        response_token = requests.post("https://api.intra.42.fr/oauth/token", params={
            "grant_type": "authorization_code",
            "client_id": "u-s4t2ud-0a05cb1e9d70fbc329f27e221393b94744a04cc10bf200489c0273993074e3de",
            "client_secret": environ.get("API_42_SECRET_KEY"),
            "code": code,
            "redirect_uri": "http://localhost:8000/api/auth/42/token"
        })

        if response_token.status_code != 200:
            return render(request, "oauth.html", {"data": {"status": "failed"}},
                          status=response_token.status_code)

        response_token_json = response_token.json()

        response_me = requests.get("https://api.intra.42.fr/v2/me", headers={
            "Authorization": "Bearer " + response_token_json["access_token"]
        })

        if response_me.status_code != 200:
            return render(request, "oauth.html", {"data": {"status": "failed"}},
                          status=response_token.status_code)

        return render(request, "oauth.html",
                      {"data": {"status": "success", "name": response_me.json()["displayname"]}},
                      status=405)

    else:
        return render(request, "oauth.html", {"data": {"status": "failed"}},
                      status=405)
