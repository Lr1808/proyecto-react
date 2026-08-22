"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

django_application = get_asgi_application()

from api.routing import websocket_urlpatterns
from api.websocket.middleware import JWTAuthMiddlewareStack

application = ProtocolTypeRouter(
	{
		"http": django_application,
		"websocket": AuthMiddlewareStack(
			JWTAuthMiddlewareStack(URLRouter(websocket_urlpatterns))
		),
	}
)
