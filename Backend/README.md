# CodeGrade API

Backend Django REST para ejercicios de programación, autoevaluación con Judge0 y chat docente-estudiante.

## Arranque

```powershell
Backend\.venv\Scripts\Activate.ps1
cd Backend
Copy-Item .env.example .env
python manage.py migrate
python manage.py runserver
```

El proyecto usa SQLite por defecto. Para PostgreSQL, cambia `DATABASE_URL` en `.env`.
Configura `JUDGE0_API_KEY` antes de usar `/api/submissions/submit/`.

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
