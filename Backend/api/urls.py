from django.urls import path

from api.routers.auth import me, register
from api.routers.exercises import exercise_detail, exercises
from api.routers.submissions import submit
from .views import health

urlpatterns = [
    path("health/", health, name="health"),
    path("auth/register/", register, name="register"),
    path("auth/me/", me, name="me"),
    path("exercises/", exercises, name="exercises"),
    path("exercises/<int:exercise_id>/", exercise_detail, name="exercise-detail"),
    path("submissions/submit/", submit, name="submit"),
]
