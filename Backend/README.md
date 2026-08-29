# CodeGrade API

Backend Django REST para ejercicios de programación, autoevaluación con Judge0 y chat docente-estudiante.

## Arranque

```powershell
cd Backend
Copy-Item .env.example .env
.\.venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py runserver
```

El proyecto usa SQLite por defecto para desarrollo local. Para PostgreSQL/Supabase, cambia `DATABASE_URL` en `.env` con la cadena de conexión que te da Supabase:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require
```

Configura `JUDGE0_API_KEY` antes de usar `/api/submissions/submit/`.

## Preparación para Supabase

1. Crea un proyecto en Supabase.
2. Abre Project Settings > Database.
3. Copia la URL de conexión del nodo "Connection string".
4. Pega esa URL en `Backend/.env` como `DATABASE_URL`.
5. Ejecuta:

```powershell
python manage.py migrate
python manage.py createsuperuser
```

Si usas Supabase con SSL, asegura que la cadena incluya `?sslmode=require`.

## API

- `POST /api/auth/register/`: crea usuario y devuelve tokens JWT.
- `POST /api/auth/login/`: recibe `email` y `password`.
- `GET /api/auth/me/`: perfil autenticado.
- `GET /api/exercises/?difficulty=easy&language=python`: lista ejercicios.
- `POST /api/exercises/`: crea ejercicio con `test_cases` como profesor.
- `GET /api/exercises/<id>/`: detalle; un estudiante no recibe soluciones ocultas.
- `POST /api/submissions/submit/`: recibe `{ "exercise_id": 1, "code": "..." }`.
- `GET /api/health/`: comprobación del servicio.

En HTTP, enviar `Authorization: Bearer <access_token>`.
Para chat, conectar a `ws://127.0.0.1:8000/ws/chat/<exercise_id>/<target_user_id>/?token=<access_token>` y enviar `{ "message": "..." }`.
