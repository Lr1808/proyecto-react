from __future__ import annotations

from typing import Any

from django.conf import settings

try:
    from supabase import Client, create_client
except ImportError:  # pragma: no cover
    Client = Any  # type: ignore[misc, assignment]
    create_client = None  # type: ignore[assignment]


def get_supabase_client() -> Client | None:
    if not settings.SUPABASE_URL or not settings.SUPABASE_PUBLISHABLE_KEY:
        return None
    if create_client is None:
        raise RuntimeError("La dependencia 'supabase' no está instalada. Añádela a requirements.txt.")
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_PUBLISHABLE_KEY)


def is_supabase_available() -> bool:
    return bool(settings.SUPABASE_URL and settings.SUPABASE_PUBLISHABLE_KEY)
