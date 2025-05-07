import uuid
import os
import base64
import struct
import hashlib
import hmac
import time
import requests
from django.shortcuts import render
from django.http import HttpRequest, JsonResponse
from .game import games



def main_page(request):
    return render(request, 'main.html')


def pingpong_game(request):
    return render(request, 'pingpong.html')


def choose_game(request: HttpRequest):
    secret = os.urandom(20)

    # time_step = 30
    # counter = int(time.time() // time_step)
    # counter_bytes = struct.pack(">Q", counter)
    # hmac_hash = hmac.new(secret, counter_bytes, hashlib.sha1).digest()
    # offset = hmac_hash[-1] & 0x0F
    # code = ((hmac_hash[offset] & 0x7f) << 24 |
    #         (hmac_hash[offset + 1] & 0xff) << 16 |
    #         (hmac_hash[offset + 2] & 0xff) << 8 |
    #         (hmac_hash[offset + 3] & 0xff))

    url = "otpauth://totp/ft_transcendence:" + "test@test.com" \
          + "?secret=" + base64.b32encode(secret).decode("utf-8") \
          + "&issuer=ft_transcendence"

    data = { "players": [], "uid": uuid.uuid4(), "url": url }

    for game in games:
        data["players"].append({"id": game.uid, "name": game.name})

    return render(request, "choose_game.html", {"data": data})


def auth_42_callback(request: HttpRequest):
    if request.method == "GET":
        code = request.GET.get("code")
        if not code:
            return render(request, "oauth.html", {"data": {"status": "failed"}},
                          status=400)

        response_token = requests.post("https://api.intra.42.fr/oauth/token", params={
            "grant_type": "authorization_code",
            "client_id": "u-s4t2ud-0a05cb1e9d70fbc329f27e221393b94744a04cc10bf200489c0273993074e3de",
            "client_secret": os.environ.get("API_42_SECRET_KEY"),
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
