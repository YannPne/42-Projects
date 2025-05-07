import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from app.urls import ws_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": URLRouter(ws_urlpatterns)
})
