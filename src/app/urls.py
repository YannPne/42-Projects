from django.urls import path
from . import views, consumers

app_name = 'app'

urlpatterns = [
    path('', views.main_page, name='main'),
    path('pingpong/', views.pingpong_game, name='pingpong'),

    path('api/games', views.api_games),
    path('api/auth/42/callback', views.auth_42_callback),
]

ws_urlpatterns = [
    path('ws/game', consumers.GameConsumer.as_asgi()),
]