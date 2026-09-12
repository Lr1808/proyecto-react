# CodeGrade: arquitectura backend

## Modelo de datos

- `User`: identidad y rol (`teacher` o `student`).
- `Course`: clase creada por un profesor.
- `CourseMembership`: relación estudiante-curso, única por pareja.
- `Exercise`: enunciado y lenguaje de programación.
- `TestCase`: entrada, salida esperada, orden y visibilidad.
- `Assignment`: ejercicio publicado en un curso con inicio, vencimiento y límite opcional.
- `Submission`: código enviado, nota, tiempo y estado `PENDING`, `PASSED` o `FAILED`.
- `SubmissionTestResult`: resultado independiente de cada caso de prueba.

La migración `0002_course_assignment_results` crea las relaciones y restricciones de unicidad. PostgreSQL/Supabase es la base de datos objetivo mediante `DATABASE_URL`.

## Ejecución aislada

Django no ejecuta el código del alumno en su propio proceso. `api.services.judge0.run_test` envía cada caso a Judge0, que proporciona aislamiento, límites de tiempo y separación del runtime. El router solo agrega resultados, calcula `score = tests_passed / total_tests * 100` y persiste `Submission` junto con sus `SubmissionTestResult`.

Para producción, el adaptador debe usar una instancia Judge0 administrada o un worker interno con contenedor efímero, sin privilegios, filesystem temporal, red deshabilitada, CPU/memoria limitadas y timeout estricto. Nunca debe usarse `exec` sobre el servidor web.

## API REST

Todas las rutas salvo salud requieren un Bearer de Supabase.

- Supabase Auth gestiona registro, login, refresh y logout. Django solo valida el Bearer de Supabase y expone `GET /api/auth/me/` para el perfil local sincronizado.
- `GET /api/courses/`: listar cursos
- `POST /api/courses/`: profesor crea curso (`code`, `name`, `description`)
- `POST /api/courses/{id}/join/`: estudiante se matricula
- `GET /api/courses/{id}/assignments/`: listar asignaciones
- `POST /api/courses/{id}/assignments/`: profesor publica ejercicio (`exercise`, `title`, `starts_at`, `due_at`, `time_limit_minutes`)
- `GET /api/exercises/`, `GET /api/exercises/{id}/`
- `POST /api/exercises/`: profesor crea ejercicio con `test_cases[]`
- `POST /api/submissions/submit/`: estudiante envía `{exercise_id, code}`

La respuesta de envío incluye `submission`, `verdict`, `score` y `test_results`. Los casos ocultos no exponen la salida esperada al estudiante.
