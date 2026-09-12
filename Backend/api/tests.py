from django.test import TestCase
from rest_framework.test import APIClient

from .models import Exercise, Question, TestCase as ExerciseTestCase, User


class CodeGradeApiTests(TestCase):
	def setUp(self):
		self.client = APIClient()
		self.teacher = User.objects.create_user(
			email="teacher@example.com", password="secure-pass-123", full_name="Teacher", role="teacher"
		)
		self.student = User.objects.create_user(
			email="student@example.com", password="secure-pass-123", full_name="Student", role="student"
		)
		self.exercise = Exercise.objects.create(
			title="Suma", description="Suma dos números", difficulty="easy",
			programming_language="python", teacher=self.teacher,
		)
		ExerciseTestCase.objects.create(
			exercise=self.exercise, input_data="1 2", expected_output="3", is_hidden=True
		)

	def test_health_endpoint_is_public(self):
		response = self.client.get("/api/health/")
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["status"], "ok")

	def test_student_cannot_see_hidden_expected_output(self):
		self.client.force_authenticate(self.student)
		response = self.client.get(f"/api/exercises/{self.exercise.id}/")
		self.assertEqual(response.status_code, 200)
		self.assertNotIn("expected_output", response.data["test_cases"][0])

	def test_teacher_can_create_exercise_with_tests(self):
		self.client.force_authenticate(self.teacher)
		response = self.client.post("/api/exercises/", {
			"title": "Resta", "description": "Resta dos números", "difficulty": "medium",
			"programming_language": "python", "test_cases": [{"input_data": "4 2", "expected_output": "2"}],
		}, format="json")
		self.assertEqual(response.status_code, 201)
		self.assertEqual(response.data["test_cases"][0]["expected_output"], "2")

	def test_student_can_submit_theory_answers_and_receive_feedback(self):
		question = Question.objects.create(
			exercise=self.exercise,
			question_text="¿Cuánto es 2 + 2?",
			question_type=Question.QuestionType.NUMERICAL,
			correct_answer=4,
			points=2,
			explanation="La suma de ambos valores es cuatro.",
		)
		self.client.force_authenticate(self.student)
		before = self.client.get(f"/api/exercises/{self.exercise.id}/")
		self.assertNotIn("correct_answer", before.data["questions"][0])
		self.assertNotIn("explanation", before.data["questions"][0])

		response = self.client.post(
			f"/api/exercises/{self.exercise.id}/submit/",
			{"answers": [{"question_id": question.id, "answer": "4"}]},
			format="json",
		)
		self.assertEqual(response.status_code, 201)
		self.assertEqual(response.data["percentage"], 100)
		self.assertTrue(response.data["passed"])
		self.assertEqual(response.data["feedback"][0]["explanation"], question.explanation)

	def test_student_can_manage_draft_answers_on_same_route(self):
		self.client.force_authenticate(self.student)
		initial = self.client.get(f"/api/exercises/{self.exercise.id}/draft/")
		self.assertEqual(initial.status_code, 200)
		self.assertEqual(initial.data["answers"], {})

		put_response = self.client.put(
			f"/api/exercises/{self.exercise.id}/draft/",
			{"answers": {"1": "respuesta guardada"}},
			format="json",
		)
		self.assertEqual(put_response.status_code, 200)
		self.assertEqual(put_response.data["answers"], {"1": "respuesta guardada"})

		get_response = self.client.get(f"/api/exercises/{self.exercise.id}/draft/")
		self.assertEqual(get_response.status_code, 200)
		self.assertEqual(get_response.data["answers"], {"1": "respuesta guardada"})

		delete_response = self.client.delete(f"/api/exercises/{self.exercise.id}/draft/")
		self.assertEqual(delete_response.status_code, 204)

		final_response = self.client.get(f"/api/exercises/{self.exercise.id}/draft/")
		self.assertEqual(final_response.status_code, 200)
		self.assertEqual(final_response.data["answers"], {})