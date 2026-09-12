import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django

django.setup()

from api.models import Exercise, Question, User


EXERCISES = [
    {
        "category": Exercise.Category.DATABASE,
        "title": "Consultas SQL que sí escalan",
        "description": "Usa SELECT, JOIN y GROUP BY para obtener métricas de una tienda.",
        "difficulty": Exercise.Difficulty.MEDIUM,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [
            ("¿Qué cláusula filtra filas antes de agrupar?", Question.QuestionType.MULTIPLE_CHOICE, ["WHERE", "HAVING", "ORDER BY", "LIMIT"], "WHERE", 10, "WHERE filtra filas antes de la agrupación."),
            ("Un índice puede acelerar búsquedas sobre columnas consultadas frecuentemente.", Question.QuestionType.BOOLEAN, [], True, 10, "Los índices reducen el trabajo de búsqueda, aunque tienen coste de escritura."),
        ],
    },
    {
        "category": Exercise.Category.PYTHON,
        "title": "Python: funciones y testing",
        "description": "Combina funciones, listas y casos límite para construir una solución robusta.",
        "difficulty": Exercise.Difficulty.EASY,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [
            ("¿Qué estructura almacena pares clave-valor?", Question.QuestionType.MULTIPLE_CHOICE, ["Lista", "Diccionario", "Tupla", "Set"], "Diccionario", 10, "Los diccionarios relacionan claves con valores."),
            ("Escribe una función que devuelva la suma de dos enteros.", Question.QuestionType.CODE_CHALLENGE, [], None, 20, "Prueba primero con 2 y 3, y después con valores negativos.", [{"input_data": "2 3", "expected_output": "5"}, {"input_data": "-2 5", "expected_output": "3"}]),
        ],
    },
    {
        "category": Exercise.Category.REACT,
        "title": "React: estado sin sorpresas",
        "description": "Identifica cuándo usar estado, props y efectos en una interfaz React 19.",
        "difficulty": Exercise.Difficulty.MEDIUM,
        "programming_language": Exercise.Language.JAVASCRIPT,
        "questions": [
            ("¿Qué hook conserva estado local entre renders?", Question.QuestionType.MULTIPLE_CHOICE, ["useEffect", "useState", "useMemo", "useId"], "useState", 10, "useState devuelve el valor y su actualizador."),
            ("Los props deben mutarse directamente dentro de un componente.", Question.QuestionType.BOOLEAN, [], False, 10, "Los props son de solo lectura; el estado pertenece al componente que lo controla."),
        ],
    },
    {
        "category": Exercise.Category.GIT,
        "title": "Git: historial limpio",
        "description": "Resuelve situaciones comunes de ramas, commits y recuperación de cambios.",
        "difficulty": Exercise.Difficulty.EASY,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [
            ("¿Qué comando crea una rama y cambia a ella?", Question.QuestionType.MULTIPLE_CHOICE, ["git merge", "git switch -c", "git log", "git stash"], "git switch -c", 10, "git switch -c nombre crea y activa la rama."),
            ("¿Qué comando inspecciona el historial de commits?", Question.QuestionType.CODE_CHALLENGE, [], None, 10, "git log muestra el historial; en este reto escribe el comando exacto.", [{"input_data": "", "expected_output": "git log"}]),
        ],
    },
    {
        "category": Exercise.Category.TERMINAL,
        "title": "Terminal: moverse con intención",
        "description": "Practica navegación, búsqueda y composición de comandos en la terminal.",
        "difficulty": Exercise.Difficulty.EASY,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [
            ("¿Qué comando muestra el directorio actual?", Question.QuestionType.MULTIPLE_CHOICE, ["pwd", "cd", "ls", "mkdir"], "pwd", 10, "pwd imprime la ruta del directorio de trabajo actual."),
            ("El operador | conecta la salida de un comando con la entrada de otro.", Question.QuestionType.BOOLEAN, [], True, 10, "El pipe permite componer comandos en una misma cadena."),
        ],
    },
]

EXERCISES.extend([
    {
        "category": Exercise.Category.PYTHON,
        "title": "Listas y comprehensions",
        "description": "Transforma colecciones de datos con listas, filtros y comprehensions.",
        "difficulty": Exercise.Difficulty.EASY,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("¿Qué expresión crea una lista con los cuadrados del 1 al 3?", Question.QuestionType.MULTIPLE_CHOICE, ["[x * x for x in range(1, 4)]", "square(1, 3)", "[x ^ 2]", "list.square(3)"], "[x * x for x in range(1, 4)]", 10, "Las comprehensions permiten construir listas a partir de una iteración.")],
    },
    {
        "category": Exercise.Category.PYTHON,
        "title": "Diccionarios en Python",
        "description": "Consulta, actualiza y recorre estructuras de clave y valor.",
        "difficulty": Exercise.Difficulty.EASY,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("Un diccionario almacena datos mediante pares clave-valor.", Question.QuestionType.BOOLEAN, [], True, 10, "Cada entrada de un diccionario asocia una clave con un valor.")],
    },
    {
        "category": Exercise.Category.PYTHON,
        "title": "Bucles y control de flujo",
        "description": "Practica for, while, break y continue con problemas cotidianos.",
        "difficulty": Exercise.Difficulty.EASY,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("¿Qué palabra detiene inmediatamente un bucle?", Question.QuestionType.MULTIPLE_CHOICE, ["continue", "break", "stop", "exit-loop"], "break", 10, "break termina el bucle actual.")],
    },
    {
        "category": Exercise.Category.PYTHON,
        "title": "Excepciones y validación",
        "description": "Controla errores de entrada sin romper la experiencia de usuario.",
        "difficulty": Exercise.Difficulty.MEDIUM,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("¿Qué bloque captura una excepción en Python?", Question.QuestionType.MULTIPLE_CHOICE, ["catch", "except", "rescue", "handle"], "except", 10, "except se usa junto a try para manejar errores.")],
    },
    {
        "category": Exercise.Category.PYTHON,
        "title": "Módulos y paquetes",
        "description": "Organiza funciones reutilizables en módulos mantenibles.",
        "difficulty": Exercise.Difficulty.MEDIUM,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("La sentencia import permite reutilizar código de otro módulo.", Question.QuestionType.BOOLEAN, [], True, 10, "import carga un módulo para usar sus nombres.")],
    },
    {
        "category": Exercise.Category.PYTHON,
        "title": "Programación orientada a objetos",
        "description": "Modela entidades con clases, atributos, métodos y encapsulación.",
        "difficulty": Exercise.Difficulty.HARD,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("¿Qué método se ejecuta al crear una instancia normalmente?", Question.QuestionType.MULTIPLE_CHOICE, ["__start__", "__init__", "constructor", "new"], "__init__", 10, "__init__ inicializa una instancia después de crearla.")],
    },
    {
        "category": Exercise.Category.PYTHON,
        "title": "Funciones lambda",
        "description": "Resuelve transformaciones pequeñas usando funciones anónimas.",
        "difficulty": Exercise.Difficulty.MEDIUM,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("Una función lambda puede escribirse sin declarar un nombre con def.", Question.QuestionType.BOOLEAN, [], True, 10, "lambda crea funciones anónimas de una sola expresión.")],
    },
    {
        "category": Exercise.Category.DATABASE,
        "title": "Normalización de tablas",
        "description": "Diseña tablas con menos duplicación y relaciones claras.",
        "difficulty": Exercise.Difficulty.MEDIUM,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("¿Qué objetivo principal tiene normalizar una base de datos?", Question.QuestionType.MULTIPLE_CHOICE, ["Duplicar datos", "Reducir redundancia", "Eliminar claves", "Evitar relaciones"], "Reducir redundancia", 10, "La normalización reduce duplicación y anomalías de actualización.")],
    },
    {
        "category": Exercise.Category.DATABASE,
        "title": "Subconsultas y agregaciones",
        "description": "Combina COUNT, AVG y subconsultas para obtener indicadores.",
        "difficulty": Exercise.Difficulty.MEDIUM,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("¿Qué función SQL calcula un promedio?", Question.QuestionType.MULTIPLE_CHOICE, ["SUM", "AVG", "MEAN", "MID"], "AVG", 10, "AVG calcula el promedio de valores numéricos.")],
    },
    {
        "category": Exercise.Category.DATABASE,
        "title": "Índices y rendimiento",
        "description": "Identifica cuándo un índice mejora una consulta y cuándo añade coste.",
        "difficulty": Exercise.Difficulty.HARD,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("Un índice puede acelerar lecturas, pero también aumenta el coste de algunas escrituras.", Question.QuestionType.BOOLEAN, [], True, 10, "Los índices deben elegirse según los patrones de consulta.")],
    },
    {
        "category": Exercise.Category.DATABASE,
        "title": "Transacciones y consistencia",
        "description": "Comprende commit, rollback y operaciones atómicas.",
        "difficulty": Exercise.Difficulty.HARD,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("¿Qué operación deshace una transacción no confirmada?", Question.QuestionType.MULTIPLE_CHOICE, ["COMMIT", "ROLLBACK", "RETRY", "UNDO TABLE"], "ROLLBACK", 10, "ROLLBACK devuelve la transacción al estado anterior.")],
    },
    {
        "category": Exercise.Category.REACT,
        "title": "Componentes reutilizables",
        "description": "Construye componentes pequeños mediante composición y props.",
        "difficulty": Exercise.Difficulty.MEDIUM,
        "programming_language": Exercise.Language.JAVASCRIPT,
        "questions": [("Los props de un componente React deben mutarse directamente.", Question.QuestionType.BOOLEAN, [], False, 10, "Los props son de solo lectura; el componente padre controla su valor.")],
    },
    {
        "category": Exercise.Category.REACT,
        "title": "Hooks y efectos",
        "description": "Distingue estado, efectos y valores derivados en React.",
        "difficulty": Exercise.Difficulty.MEDIUM,
        "programming_language": Exercise.Language.JAVASCRIPT,
        "questions": [("¿Qué hook permite ejecutar lógica después de un render?", Question.QuestionType.MULTIPLE_CHOICE, ["useState", "useEffect", "useContext", "useRef"], "useEffect", 10, "useEffect sincroniza el componente con sistemas externos.")],
    },
    {
        "category": Exercise.Category.REACT,
        "title": "Rutas y navegación",
        "description": "Organiza vistas protegidas y navegación entre pantallas.",
        "difficulty": Exercise.Difficulty.HARD,
        "programming_language": Exercise.Language.JAVASCRIPT,
        "questions": [("Una ruta protegida debe comprobar la autenticación antes de mostrar su contenido.", Question.QuestionType.BOOLEAN, [], True, 10, "La comprobación evita mostrar vistas privadas a usuarios no autenticados.")],
    },
    {
        "category": Exercise.Category.REACT,
        "title": "Accesibilidad en interfaces",
        "description": "Mejora botones, formularios y navegación para más personas.",
        "difficulty": Exercise.Difficulty.MEDIUM,
        "programming_language": Exercise.Language.JAVASCRIPT,
        "questions": [("¿Qué atributo relaciona un input con el texto que lo describe?", Question.QuestionType.MULTIPLE_CHOICE, ["for en label", "name-only", "description", "title-only"], "for en label", 10, "label con for asociado al id del input mejora la accesibilidad.")],
    },
    {
        "category": Exercise.Category.GIT,
        "title": "Ramas y merge",
        "description": "Integra cambios de distintas ramas y resuelve conflictos.",
        "difficulty": Exercise.Difficulty.EASY,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("¿Qué comando integra una rama en la rama actual?", Question.QuestionType.MULTIPLE_CHOICE, ["git merge", "git branch", "git status", "git init"], "git merge", 10, "git merge incorpora el historial de otra rama.")],
    },
    {
        "category": Exercise.Category.GIT,
        "title": "Rebase interactivo",
        "description": "Limpia commits locales antes de compartir una rama.",
        "difficulty": Exercise.Difficulty.HARD,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("El rebase interactivo permite reorganizar commits locales.", Question.QuestionType.BOOLEAN, [], True, 10, "Permite editar, combinar o reordenar commits antes de publicarlos.")],
    },
    {
        "category": Exercise.Category.GIT,
        "title": "Pull requests y revisión",
        "description": "Prepara cambios revisables y comunica decisiones técnicas.",
        "difficulty": Exercise.Difficulty.MEDIUM,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("¿Qué debe incluir una buena pull request?", Question.QuestionType.MULTIPLE_CHOICE, ["Solo un título", "Contexto, cambios y pruebas", "La contraseña del repositorio", "Archivos temporales"], "Contexto, cambios y pruebas", 10, "El contexto y la evidencia facilitan una revisión útil.")],
    },
    {
        "category": Exercise.Category.TERMINAL,
        "title": "Búsqueda y seguimiento",
        "description": "Encuentra archivos, texto y cambios en proyectos grandes.",
        "difficulty": Exercise.Difficulty.EASY,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("¿Qué comando busca texto dentro de archivos?", Question.QuestionType.MULTIPLE_CHOICE, ["grep", "pwd", "mkdir", "whoami"], "grep", 10, "grep busca coincidencias de texto en archivos o entradas.")],
    },
    {
        "category": Exercise.Category.TERMINAL,
        "title": "Pipelines y redirección",
        "description": "Combina comandos con pipes y redirecciones de salida.",
        "difficulty": Exercise.Difficulty.MEDIUM,
        "programming_language": Exercise.Language.PYTHON,
        "questions": [("El operador | envía la salida de un comando a otro.", Question.QuestionType.BOOLEAN, [], True, 10, "El pipe conecta stdout con stdin del siguiente comando.")],
    },
])


def main():
    teacher, _ = User.objects.get_or_create(email="admin@example.com", defaults={"full_name": "Admin Principal", "role": User.Role.TEACHER})
    teacher.role = User.Role.TEACHER
    teacher.full_name = "Admin Principal"
    teacher.is_staff = True
    teacher.is_superuser = True
    teacher.set_password("Admin1234!")
    teacher.save()
    User.objects.get_or_create(email="student@example.com", defaults={"full_name": "Alumno Demo", "role": User.Role.STUDENT})

    for item in EXERCISES:
        exercise, _ = Exercise.objects.update_or_create(
            title=item["title"],
            defaults={"description": item["description"], "category": item["category"], "level": Exercise.Level.INTERMEDIATE if item["category"] in {Exercise.Category.DATABASE, Exercise.Category.REACT} else Exercise.Level.BEGINNER, "is_exam": item["category"] in {Exercise.Category.DATABASE, Exercise.Category.REACT}, "difficulty": item["difficulty"], "programming_language": item["programming_language"], "teacher": teacher, "time_limit_minutes": 30, "passing_score": 60, "is_active": True},
        )
        for order, question_data in enumerate(item["questions"]):
            text, question_type, options, correct, points, explanation, *test_cases = question_data
            Question.objects.update_or_create(
                exercise=exercise,
                order=order,
                defaults={"question_text": text, "question_type": question_type, "options": options, "correct_answer": correct if correct is not None else {}, "points": points, "explanation": explanation, "code_language_id": 71 if question_type == Question.QuestionType.CODE_CHALLENGE else None, "test_cases": test_cases[0] if test_cases else []},
            )

    print(f"teacher=admin@example.com student=student@example.com exercises={Exercise.objects.count()} questions={Question.objects.count()}")


if __name__ == "__main__":
    main()
