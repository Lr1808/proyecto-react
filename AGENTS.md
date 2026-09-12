# AGENTS.md

Two independent dirs, no root package.json or shared build: `Backend/` = Django 5.2 + DRF + Channels (Python, venv at `Backend/.venv`), `Frontend/` = React 19 + Vite (Vite dev server proxies `/api` to `127.0.0.1:8000`). Both sides need their own local `.env` (gitignored, required) before anything runs.

## Backend (`Backend/`)

- `Backend/.env` is mandatory: `config/settings.py` raises `ValueError` if `DATABASE_URL` is missing. Copy `.env.example` and point it at an existing Supabase PostgreSQL.
- Commands (PowerShell, from `Backend/`):
  - venv: `.\\.venv\\Scripts\\Activate.ps1` (Python is at `.\.venv\Scripts\python.exe`)
  - setup: `python manage.py migrate` → `python manage.py runserver`
  - seed demo data (idempotent): `python seed_data.py` — creates teacher `admin@example.com` / `Admin1234!` and student `student@example.com` with 5 categorized exercises. `main.py` is the older, smaller seed variant; prefer `seed_data.py`.
  - tests: `python manage.py test` — plain Django `TestCase` (no pytest). Tests use `DATABASE_URL` directly (no SQLite override), so they run against the configured Supabase DB.
- Auth: every endpoint except `/api/health/` requires `Authorization: Bearer <supabase access_token>`. Django validates the JWT via JOSE/`api.authentication.SupabaseJWTAuthentication` (JWKS), not Django sessions.
- Evaluation: `POST /api/exercises/<id>/submit/` grades theory questions in Python (`api/services/evaluator.py`) and `CODE_CHALLENGE` questions via the external Judge0 API (`api/services/judge0.py`) — needs `JUDGE0_API_KEY`.
- Per-student (student role only): `GET /api/exercises/<id>/submissions/` (attempt history with feedback), and `GET`/`PUT`/`DELETE /api/exercises/<id>/draft/` (resume in-progress attempt; stored in the `AttemptDraft` model added by migration `0008_attemptdraft` — run `python manage.py migrate`).
- Gotchas:
  - WebSockets (chat, notifications) are wired through Channels but **no ASGI server (daphne/uvicorn) is installed**, so `manage.py runserver` serves HTTP only; sockets fail in dev.
  - `requirements.txt` is the source of truth for pip deps, not `package.json` (that only pins `@supabase/server`).
  - Recent commits are in Spanish (e.g. `actualiza proyecto`, `feat: implement CodeGrade backend`); match this style.

## Frontend (`Frontend/`)

- Commands: `npm run dev` (port 5173, proxies `/api` → 127.0.0.1:8000), `npm run build`, `npm run lint` (oxlint). **No typecheck script and no tsconfig.json** — oxlint is the only static check, so TS files are not type-checked by CI or scripts.
- Env: copy `Frontend/.env.example` → `.env`. Set `VITE_SKIP_AUTH=true` for demo mode (no Supabase auth). **Login is always required** — even in demo mode you must sign in first; it validates hardcoded demo credentials (`student@example.com` / `demo1234` → student, `admin@example.com` / `Admin1234!` → teacher) with no real auth. The app throws at startup if Supabase vars are missing and `VITE_SKIP_AUTH` is not `true`.
- Quirk — codebase is **mixed JS/TSX**: newer widgets live in `src/pages/*.tsx` (TypeScript) and `src/lib/*.js`, while app wiring and most components are `src/App.jsx` / `src/components/*.jsx` (plain JS). Match the style of the file you touch; do not add type annotations to a `.jsx` file.
- Google OAuth ("Continuar con Google" via `supabase.auth.signInWithOAuth` in `App.jsx`) only shows outside demo mode and **can't work until the Google provider is enabled + keys set in the Supabase dashboard** (Auth → Providers); no config happens in the repo.