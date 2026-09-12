from django.urls import path

from api.routers.auth import me
from api.routers.exercises import exercise_detail, exercises
from api.routers.submissions import exercise_draft, exercise_submissions, submit, submit_exercise
from api.routers.courses import assignments, courses, join_course
from api.routers.dashboard import teacher_metrics
from api.routers.progress import student_attempts, student_progress
from .views import health

urlpatterns = [
    path("health/", health, name="health"),
    path("auth/me/", me, name="me"),
    path("exercises/", exercises, name="exercises"),
    path("exercises/<int:exercise_id>/", exercise_detail, name="exercise-detail"),
    path("submissions/submit/", submit, name="submit"),
    path("exercises/<int:exercise_id>/submit/", submit_exercise, name="exercise-submit"),
    path("exercises/<int:exercise_id>/submissions/", exercise_submissions, name="exercise-submissions"),
    path("exercises/<int:exercise_id>/draft/", exercise_draft, name="exercise-draft"),
    path("courses/", courses, name="courses"),
    path("courses/<int:course_id>/join/", join_course, name="course-join"),
    path("courses/<int:course_id>/assignments/", assignments, name="assignments"),
    path("teacher/metrics/", teacher_metrics, name="teacher-metrics"),
    path("student/progress/", student_progress, name="student-progress"),
    path("student/attempts/", student_attempts, name="student-attempts"),
]
