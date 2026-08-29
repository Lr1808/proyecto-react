import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django


def main():
    django.setup()

    from api.models import Exercise, TestCase, User

    teacher, _ = User.objects.get_or_create(
        email="admin@example.com",
        defaults={
            "full_name": "Admin Principal",
            "role": User.Role.TEACHER,
            "is_staff": True,
            "is_superuser": True,
        },
    )
    teacher.set_password("Admin1234!")
    teacher.save()

    student, _ = User.objects.get_or_create(
        email="student@example.com",
        defaults={
            "full_name": "Alumno Demo",
            "role": User.Role.STUDENT,
        },
    )

    exercise_1, created_1 = Exercise.objects.get_or_create(
        title="Suma de dos números",
        defaults={
            "description": "Escribe una función que sume dos números.",
            "difficulty": Exercise.Difficulty.EASY,
            "programming_language": Exercise.Language.PYTHON,
            "teacher": teacher,
        },
    )
    if created_1:
        TestCase.objects.create(
            exercise=exercise_1,
            input_data="3 5",
            expected_output="8",
            is_hidden=False,
        )
        TestCase.objects.create(
            exercise=exercise_1,
            input_data="10 2",
            expected_output="12",
            is_hidden=True,
        )

    exercise_2, created_2 = Exercise.objects.get_or_create(
        title="Multiplica dos números",
        defaults={
            "description": "Multiplica dos valores de entrada.",
            "difficulty": Exercise.Difficulty.MEDIUM,
            "programming_language": Exercise.Language.PYTHON,
            "teacher": teacher,
        },
    )
    if created_2:
        TestCase.objects.create(
            exercise=exercise_2,
            input_data="4 6",
            expected_output="24",
            is_hidden=False,
        )

    print("Usuarios:", User.objects.count())
    print("Ejercicios:", Exercise.objects.count())
    print("Casos de prueba:", TestCase.objects.count())
    print("Admin:", teacher.email)
    print("Alumno:", student.email)


if __name__ == "__main__":
    main()
