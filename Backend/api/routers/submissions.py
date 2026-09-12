from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.models import AttemptDraft, Exercise, Submission, SubmissionTestResult
from api.permissions import IsStudent
from api.serializers import SubmissionSerializer
from api.services.evaluator import evaluate_submission
from api.services.judge0 import run_test


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsStudent])
def submit(request):
    exercise = get_object_or_404(
        Exercise.objects.filter(is_active=True).prefetch_related("test_cases"),
        id=request.data.get("exercise_id"),
    )
    code = request.data.get("code")
    if not isinstance(code, str) or not code.strip():
        return Response({"detail": "El campo code es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

    results = []
    try:
        for test_case in exercise.test_cases.all():
            result = run_test(exercise.programming_language, code, test_case.input_data, test_case.expected_output)
            results.append({
                "test_case_id": test_case.id,
                "passed": result.passed,
                "status": result.status,
                "execution_time": result.execution_time,
                **({"output": result.output} if not test_case.is_hidden else {}),
            })
    except (RuntimeError, ValueError) as error:
        return Response({"detail": str(error)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception:
        return Response({"detail": "No se pudo ejecutar el código en Judge0."}, status=status.HTTP_502_BAD_GATEWAY)

    passed = sum(item["passed"] for item in results)
    score = (passed / len(results) * 100) if results else 0
    if any(item["status"] == "TIME_LIMIT_EXCEEDED" for item in results):
        verdict = Submission.Status.FAILED
    elif any(item["status"] == "ERROR" for item in results):
        verdict = Submission.Status.FAILED
    elif passed == len(results):
        verdict = Submission.Status.PASSED
    else:
        verdict = Submission.Status.FAILED
    execution_times = [item["execution_time"] for item in results if item["execution_time"] is not None]
    submission = Submission.objects.create(
        exercise=exercise,
        student=request.user,
        code_submitted=code,
        status=verdict,
        execution_time=sum(execution_times) if execution_times else None,
        score=score,
    )
    SubmissionTestResult.objects.bulk_create([
        SubmissionTestResult(
            submission=submission,
            test_case_id=result["test_case_id"],
            passed=result["passed"],
            status=result["status"],
            actual_output=result.get("output", ""),
            execution_time=result.get("execution_time"),
        )
        for result in results
    ])
    return Response({"submission": SubmissionSerializer(submission).data, "verdict": verdict, "score": score, "test_results": results})


@api_view(["POST"])
@permission_classes([IsAuthenticated, IsStudent])
def submit_exercise(request, exercise_id):
    exercise = get_object_or_404(
        Exercise.objects.prefetch_related("questions"),
        id=exercise_id,
        is_active=True,
    )
    answers = request.data.get("answers")
    if not isinstance(answers, list):
        return Response({"detail": "answers debe ser una lista."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        submission = evaluate_submission(exercise=exercise, student=request.user, answers=answers)
    except (RuntimeError, ValueError) as error:
        return Response({"detail": str(error)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    result = SubmissionSerializer(submission).data
    feedback = [
        {
            "question_id": answer.question_id,
            "is_correct": answer.is_correct,
            "score_awarded": answer.score_awarded,
            "explanation": answer.question.explanation,
            "judge0_output": answer.judge0_output,
        }
        for answer in submission.answers.select_related("question").all()
    ]
    return Response({
        "submission": result,
        "score": submission.total_score,
        "max_possible_score": submission.max_possible_score,
        "percentage": submission.percentage,
        "passed": submission.passed,
        "feedback": feedback,
    }, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStudent])
def exercise_submissions(request, exercise_id):
    submissions = (
        Submission.objects.filter(exercise_id=exercise_id, student=request.user)
        .prefetch_related("answers__question")
        .order_by("-submitted_at")
    )
    return Response([
        {
            "id": submission.id,
            "status": submission.status,
            "percentage": submission.percentage,
            "passed": submission.passed,
            "submitted_at": submission.submitted_at,
            "answers": [
                {
                    "question_id": answer.question_id,
                    "question_text": answer.question.question_text,
                    "student_answer": answer.student_answer if not isinstance(answer.student_answer, str) else answer.student_answer,
                    "is_correct": answer.is_correct,
                    "score_awarded": answer.score_awarded,
                    "explanation": answer.question.explanation,
                }
                for answer in submission.answers.all()
            ],
        }
        for submission in submissions
    ])


@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated, IsStudent])
def exercise_draft(request, exercise_id):
    get_object_or_404(Exercise.objects.filter(is_active=True), id=exercise_id)

    if request.method == "GET":
        draft = AttemptDraft.objects.filter(exercise_id=exercise_id, student=request.user).first()
        return Response({"answers": draft.answers if draft else {}, "updated_at": draft.updated_at if draft else None})

    if request.method == "PUT":
        answers = request.data.get("answers")
        if not isinstance(answers, dict):
            return Response({"detail": "answers debe ser un objeto."}, status=status.HTTP_400_BAD_REQUEST)
        draft, _ = AttemptDraft.objects.update_or_create(
            exercise_id=exercise_id, student=request.user, defaults={"answers": answers}
        )
        return Response({"answers": draft.answers, "updated_at": draft.updated_at})

    AttemptDraft.objects.filter(exercise_id=exercise_id, student=request.user).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
