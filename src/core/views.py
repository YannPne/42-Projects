from django.shortcuts import render

def main_page(request):
    return render(request, 'main.html')

def pingpong_game(request):
    return render(request, 'pingpong.html')