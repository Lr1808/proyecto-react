from django.conf import settings


def is_supabase_configured() -> bool:
    return bool(settings.SUPABASE_URL and settings.SUPABASE_PUBLISHABLE_KEY)


def database_status() -> dict:
    return {
        "database": "postgresql" if settings.DATABASES["default"]["ENGINE"].endswith("postgresql") else "sqlite",
        "supabase_configured": is_supabase_configured(),
        "debug": settings.DEBUG,
    }
