from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
	def create_user(self, email, password=None, **extra_fields):
		if not email:
			raise ValueError("El email es obligatorio")
		user = self.model(email=self.normalize_email(email), **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, password=None, **extra_fields):
		extra_fields.setdefault("is_staff", True)
		extra_fields.setdefault("is_superuser", True)
		extra_fields.setdefault("role", User.Role.TEACHER)
		return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
	class Role(models.TextChoices):
		TEACHER = "teacher", "Teacher"
		STUDENT = "student", "Student"

	email = models.EmailField(unique=True)
	full_name = models.CharField(max_length=150)
	role = models.CharField(max_length=10, choices=Role.choices, default=Role.STUDENT)
	created_at = models.DateTimeField(auto_now_add=True)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)

	objects = UserManager()
	USERNAME_FIELD = "email"
	REQUIRED_FIELDS = ["full_name"]

	def __str__(self):
		return self.email


class Exercise(models.Model):
	class Difficulty(models.TextChoices):
		EASY = "easy", "Easy"
		MEDIUM = "medium", "Medium"
		HARD = "hard", "Hard"

	class Language(models.TextChoices):
		PYTHON = "python", "Python"
		JAVASCRIPT = "javascript", "JavaScript"
		CPP = "cpp", "C++"

	title = models.CharField(max_length=200)
	description = models.TextField()
	difficulty = models.CharField(max_length=10, choices=Difficulty.choices)
	programming_language = models.CharField(max_length=20, choices=Language.choices)
	teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name="exercises")
	created_at = models.DateTimeField(auto_now_add=True)


class TestCase(models.Model):
	exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name="test_cases")
	input_data = models.TextField(blank=True)
	expected_output = models.TextField()
	is_hidden = models.BooleanField(default=False)


class Submission(models.Model):
	class Status(models.TextChoices):
		ACCEPTED = "ACCEPTED", "Accepted"
		WRONG_ANSWER = "WRONG_ANSWER", "Wrong answer"
		TIME_LIMIT_EXCEEDED = "TIME_LIMIT_EXCEEDED", "Time limit exceeded"
		ERROR = "ERROR", "Error"

	exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name="submissions")
	student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="submissions")
	code_submitted = models.TextField()
	status = models.CharField(max_length=30, choices=Status.choices)
	execution_time = models.FloatField(null=True, blank=True)
	score = models.FloatField(default=0)
	submitted_at = models.DateTimeField(auto_now_add=True)


class ChatMessage(models.Model):
	exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name="chat_messages")
	sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
	receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_messages")
	message_text = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)
