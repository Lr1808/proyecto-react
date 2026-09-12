from django.db.models import Avg, Count, Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.models import Exercise, Submission, SubmissionAnswer
from api.permissions import IsTeacher


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsTeacher])
def teacher_metrics(request):
    exercises = Exercise.objects.filter(teacher=request.user)
    submissions = Submission.objects.filter(exercise__in=exercises)
    aggregate = submissions.aggregate(average=Avg("percentage"))
    total = submissions.count()
    passed = submissions.filter(passed=True).count()
    ranges = [("0-19", 0, 19), ("20-39", 20, 39), ("40-59", 40, 59), ("60-79", 60, 79), ("80-100", 80, 100)]
    distribution = [
        {"range": label, "count": submissions.filter(percentage__gte=minimum, percentage__lte=maximum).count()}
        for label, minimum, maximum in ranges
    ]
    question_stats = SubmissionAnswer.objects.filter(submission__in=submissions).values(
        "question_id", "question__question_text"
    ).annotate(total=Count("id"), errors=Count("id", filter=Q(is_correct=False)))
    critical_questions = [
        {
            "question_id": item["question_id"],
            "question_text": item["question__question_text"],
            "error_rate": round(item["errors"] / item["total"] * 100, 2),
        }
        for item in question_stats
    ]
    critical_questions.sort(key=lambda item: item["error_rate"], reverse=True)
    return Response({
        "total_submissions": total,
        "average_percentage": round(aggregate["average"] or 0, 2),
        "pass_rate": round(passed / total * 100, 2) if total else 0,
        "distribution": distribution,
        "critical_questions": critical_questions[:10],
    })