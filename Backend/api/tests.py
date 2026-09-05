from django.test import TestCase
from rest_framework.test import APIClient

from .models import Exercise, TestCase as ExerciseTestCase, User


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

	def test_register_and_login(self):
		response = self.client.post("/api/auth/register/", {
			"email": "new@example.com", "password": "secure-pass-123", "full_name": "New User", "role": "student",
		}, format="json")
		self.assertEqual(response.status_code, 201)
		response = self.client.post("/api/auth/login/", {
			"email": "new@example.com", "password": "secure-pass-123",
		}, format="json")
		self.assertEqual(response.status_code, 200)
		self.assertIn("access", response.data)

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

	def test_api_guide_page_is_available(self):
		response = self.client.get("/api/guide/")
		self.assertEqual(response.status_code, 200)
		self.assertContains(response, "CodeGrade API Guide")
