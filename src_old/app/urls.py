from django.urls import path, re_path
from . import views, consumers

app_name = 'app'

urlpatterns = [
    path('', views.main_page, name='main'),
    path('pingpong/', views.pingpong_game, name='pingpong'),
    path("choose_game/", views.choose_game),

    path('api/auth/42/callback', views.auth_42_callback),
]

ws_urlpatterns = [
    re_path(r"ws/game/(?P<uid>[a-f0-9-]+)$", consumers.GameConsumer.as_asgi()),
]