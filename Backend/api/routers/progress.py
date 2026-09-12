from django.db.models import Avg, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.models import Exercise, Submission, User
from api.permissions import IsStudent


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def student_attempts(request):
    submissions = Submission.objects.filter(student=request.user).select_related("exercise").order_by("-submitted_at")
    attempts = {}
    for submission in submissions:
        entry = attempts.setdefault(submission.exercise_id, {
            "exercise_id": submission.exercise_id,
            "title": submission.exercise.title,
            "attempts": 0,
            "best_percentage": 0.0,
            "passed": False,
            "last_submitted_at": None,
        })
        entry["attempts"] += 1
        entry["best_percentage"] = max(entry["best_percentage"], float(submission.percentage or 0))
        entry["passed"] = entry["passed"] or submission.passed
        entry["last_submitted_at"] = submission.submitted_at.isoformat()
    return Response(list(attempts.values()))


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def student_progress(request):
    submissions = Submission.objects.filter(student=request.user)
    passed = submissions.filter(passed=True).count()
    average = submissions.aggregate(average=Avg("percentage"))["average"] or 0
    level_order = [User.LearningLevel.BEGINNER, User.LearningLevel.INTERMEDIATE, User.LearningLevel.ADVANCED, User.LearningLevel.EXPERT]
    current_index = level_order.index(request.user.learning_level)
    unlocked_levels = level_order[:current_index + 2]
    return Response({
        "level": request.user.learning_level,
        "next_level": level_order[min(current_index + 1, len(level_order) - 1)],
        "unlocked_levels": unlocked_levels,
        "submissions": submissions.count(),
        "passed": passed,
        "average_percentage": round(float(average), 2),
        "exams_passed": submissions.filter(exercise__is_exam=True, passed=True).count(),
        "available_exercises": Exercise.objects.filter(is_active=True, level__in=unlocked_levels).count(),
    })