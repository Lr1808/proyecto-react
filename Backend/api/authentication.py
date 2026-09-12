from __future__ import annotations

from typing import Any

import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

from api.models import User


class SupabaseJWTAuthentication(authentication.BaseAuthentication):
    """Validate Supabase access tokens and synchronize the local user record."""

    def authenticate(self, request):
        header = request.headers.get("Authorization", "")
        if not header:
            return None

        scheme, _, token = header.partition(" ")
        if scheme.lower() != "bearer" or not token:
            return None

        try:
            user, claims = self.authenticate_token(token)
        except AuthenticationFailed:
            raise
        except jwt.PyJWTError as error:
            raise AuthenticationFailed("El token de Supabase no es válido.") from error
        return user, claims

    def authenticate_token(self, token: str) -> tuple[User, dict[str, Any]]:
        if not settings.SUPABASE_JWKS_URL:
            raise AuthenticationFailed("Supabase Auth no está configurado en Django.")
        try:
            unverified_claims = jwt.decode(token, options={"verify_signature": False})
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("El token de Supabase no es válido.")

        if unverified_claims.get("iss") != settings.SUPABASE_JWT_ISSUER:
            raise AuthenticationFailed("El token de Supabase no pertenece a este proyecto.")

        try:
            signing_key = jwt.PyJWKClient(settings.SUPABASE_JWKS_URL).get_signing_key_from_jwt(token).key
            claims = jwt.decode(
                token,
                signing_key,
                algorithms=settings.SUPABASE_JWT_ALGORITHMS,
                audience=settings.SUPABASE_JWT_AUDIENCE,
                issuer=settings.SUPABASE_JWT_ISSUER,
            )
        except jwt.PyJWTError as error:
            raise AuthenticationFailed("El token de Supabase no es válido.") from error

        user = self._get_or_create_user(claims)
        return user, claims

    def _get_or_create_user(self, claims: dict[str, Any]) -> User:
        supabase_uid = claims.get("sub")
        email = claims.get("email")
        if not supabase_uid or not email:
            raise AuthenticationFailed("El token de Supabase no contiene un usuario válido.")

        metadata = claims.get("user_metadata") or {}
        full_name = metadata.get("full_name") or metadata.get("name") or email.split("@", 1)[0]
        user = User.objects.filter(supabase_uid=supabase_uid).first()
        if user is None:
            user = User.objects.filter(email=email).first()
        created = user is None
        if created:
            user = User.objects.create(
                email=email,
                supabase_uid=supabase_uid,
                full_name=full_name,
                role=User.Role.STUDENT,
            )
        elif user.supabase_uid != supabase_uid:
            user.supabase_uid = supabase_uid
            user.save(update_fields=["supabase_uid"])
        if created:
            user.set_unusable_password()
            user.save(update_fields=["password"])
            return user

        changed_fields = []
        if user.email != email:
            user.email = email
            changed_fields.append("email")
        if user.full_name != full_name:
            user.full_name = full_name
            changed_fields.append("full_name")
        if changed_fields:
            user.save(update_fields=changed_fields)
        return user