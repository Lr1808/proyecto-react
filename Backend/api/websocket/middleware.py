from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken

from api.models import User


class JWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        scope = dict(scope)
        user = scope.get("user", AnonymousUser())
        if getattr(user, "is_anonymous", True):
            query_string = scope.get("query_string", b"").decode()
            token = parse_qs(query_string).get("token", [None])[0]
            if token:
                scope["user"] = await self.get_user(token)
        return await self.app(scope, receive, send)

    @database_sync_to_async
    def get_user(self, token):
        try:
            access_token = AccessToken(token)
            return User.objects.get(id=access_token["user_id"], is_active=True)
        except Exception:
            return AnonymousUser()


def JWTAuthMiddlewareStack(app):
    return JWTAuthMiddleware(app)
