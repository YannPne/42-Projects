from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.main_page, name='main'),
    path('pingpong/', views.pingpong_game, name='pingpong'),

    path('api/auth/42/token', views.auth_42_token),
]
