from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import Exercise, Submission, User
from api.serializers import SubmissionSerializer
from api.services.judge0 import run_test


@api_view(["POST"])
def submit(request):
    if request.user.role != User.Role.STUDENT:
        return Response({"detail": "Solo los estudiantes pueden enviar código."}, status=status.HTTP_403_FORBIDDEN)
    exercise = get_object_or_404(Exercise.objects.prefetch_related("test_cases"), id=request.data.get("exercise_id"))
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
        verdict = Submission.Status.TIME_LIMIT_EXCEEDED
    elif any(item["status"] == "ERROR" for item in results):
        verdict = Submission.Status.ERROR
    elif passed == len(results):
        verdict = Submission.Status.ACCEPTED
    else:
        verdict = Submission.Status.WRONG_ANSWER
    execution_times = [item["execution_time"] for item in results if item["execution_time"] is not None]
    submission = Submission.objects.create(
        exercise=exercise,
        student=request.user,
        code_submitted=code,
        status=verdict,
        execution_time=sum(execution_times) if execution_times else None,
        score=score,
    )
    return Response({"submission": SubmissionSerializer(submission).data, "verdict": verdict, "score": score, "test_results": results})
