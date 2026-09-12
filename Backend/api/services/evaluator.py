from __future__ import annotations

from decimal import Decimal, InvalidOperation

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db import transaction

from api.models import Exercise, Question, Submission, SubmissionAnswer
from api.services.judge0 import LANGUAGE_IDS, run_test


def _same_answer(expected, received):
    if isinstance(expected, (int, float, Decimal)):
        try:
            return Decimal(str(expected)) == Decimal(str(received))
        except (InvalidOperation, TypeError, ValueError):
            return False
    if isinstance(expected, bool):
        if isinstance(received, str):
            received = received.lower() == "true"
        return expected == received
    return str(expected).strip() == str(received).strip()


def _evaluate_question(question: Question, answer):
    if question.question_type != Question.QuestionType.CODE_CHALLENGE:
        correct = _same_answer(question.correct_answer, answer)
        return correct, question.points if correct else Decimal("0"), {"type": "theory"}

    if not isinstance(answer, str) or not answer.strip():
        return False, Decimal("0"), {"type": "judge0", "status": "EMPTY_CODE"}

    language = next((name for name, identifier in LANGUAGE_IDS.items() if identifier == question.code_language_id), None)
    if language is None:
        raise ValueError("La pregunta de código no tiene un lenguaje Judge0 válido.")

    results = []
    for test_case in question.test_cases:
        result = run_test(
            language,
            answer,
            test_case.get("input_data", test_case.get("stdin", "")),
            test_case.get("expected_output", ""),
        )
        results.append({
            "passed": result.passed,
            "status": result.status,
            "output": result.output,
            "execution_time": result.execution_time,
        })
    passed = bool(results) and all(result["passed"] for result in results)
    return passed, question.points if passed else Decimal("0"), {"type": "judge0", "results": results}


@transaction.atomic
def evaluate_submission(*, exercise: Exercise, student, answers: list[dict]) -> Submission:
    questions = list(exercise.questions.all())
    answer_by_question = {str(item.get("question_id")): item.get("answer") for item in answers}
    max_score = sum((question.points for question in questions), Decimal("0"))
    total_score = Decimal("0")
    evaluated = []

    for question in questions:
        is_correct, score, judge_output = _evaluate_question(
            question,
            answer_by_question.get(str(question.id)),
        )
        total_score += score
        evaluated.append((question, answer_by_question.get(str(question.id)), is_correct, score, judge_output))

    percentage = (total_score / max_score * Decimal("100")) if max_score else Decimal("0")
    passed = percentage >= exercise.passing_score
    submission = Submission.objects.create(
        exercise=exercise,
        student=student,
        code_submitted="",
        status=Submission.Status.PASSED if passed else Submission.Status.FAILED,
        score=float(percentage),
        total_score=total_score,
        max_possible_score=max_score,
        percentage=percentage,
        passed=passed,
    )
    SubmissionAnswer.objects.bulk_create([
        SubmissionAnswer(
            submission=submission,
            question=question,
            student_answer=answer,
            is_correct=is_correct,
            score_awarded=score,
            judge0_output=judge_output,
        )
        for question, answer, is_correct, score, judge_output in evaluated
    ])

    if passed and student.role == student.Role.STUDENT:
        level_order = [student.LearningLevel.BEGINNER, student.LearningLevel.INTERMEDIATE, student.LearningLevel.ADVANCED, student.LearningLevel.EXPERT]
        current_index = level_order.index(student.learning_level)
        if current_index < len(level_order) - 1 and percentage >= 85:
            student.learning_level = level_order[current_index + 1]
            student.save(update_fields=["learning_level"])

    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            f"teacher_{exercise.teacher_id}",
            {
                "type": "submission.completed",
                "submission_id": submission.id,
                "exercise_id": exercise.id,
                "student_id": student.id,
                "percentage": float(percentage),
                "passed": passed,
            },
        )
    return submission