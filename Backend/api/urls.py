from django.urls import path

from api.routers.auth import me, register
from api.routers.exercises import exercise_detail, exercises
from api.routers.submissions import submit
from api.routers.courses import assignments, courses, join_course
from .views import api_guide, health

urlpatterns = [
    path("health/", health, name="health"),
    path("guide/", api_guide, name="api-guide"),
    path("auth/register/", register, name="register"),
    path("auth/me/", me, name="me"),
    path("exercises/", exercises, name="exercises"),
    path("exercises/<int:exercise_id>/", exercise_detail, name="exercise-detail"),
    path("submissions/submit/", submit, name="submit"),
    path("courses/", courses, name="courses"),
    path("courses/<int:course_id>/join/", join_course, name="course-join"),
    path("courses/<int:course_id>/assignments/", assignments, name="assignments"),
]
