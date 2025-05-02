# game/urls.py
from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.main_page, name='main'),  # Assurez-vous que c'est bien configuré pour la page d'accueil
    path('pingpong/', views.pingpong_game, name='pingpong'),  # Assurez-vous que c'est bien configuré pour le jeu
]
