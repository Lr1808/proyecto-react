from rest_framework import serializers

from .models import Assignment, ChatMessage, Course, CourseMembership, Exercise, Question, Submission, SubmissionAnswer, SubmissionTestResult, TestCase, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name", "role", "learning_level", "created_at"]
        read_only_fields = fields


class TestCaseWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ["input_data", "expected_output", "is_hidden"]


class TestCaseReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ["id", "input_data", "expected_output", "is_hidden"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if instance.is_hidden and request and getattr(request.user, "role", None) == User.Role.STUDENT:
            data.pop("expected_output", None)
        return data


class QuestionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = [
            "question_text", "question_type", "options", "correct_answer", "code_language_id",
            "test_cases", "points", "explanation", "order",
        ]


class QuestionReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "question_text", "question_type", "options", "code_language_id", "test_cases", "points", "order"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if getattr(request, "user", None) and getattr(request.user, "role", None) == User.Role.STUDENT:
            data["test_cases"] = [
                {key: value for key, value in test_case.items() if key != "expected_output"}
                for test_case in data.get("test_cases", [])
            ]
        return data


class ExerciseWriteSerializer(serializers.ModelSerializer):
    test_cases = TestCaseWriteSerializer(many=True, required=False)
    questions = QuestionWriteSerializer(many=True, required=False)

    class Meta:
        model = Exercise
        fields = ["id", "title", "description", "category", "level", "is_exam", "difficulty", "programming_language", "time_limit_minutes", "passing_score", "is_active", "teacher", "created_at", "test_cases", "questions"]
        read_only_fields = ["id", "teacher", "created_at"]

    def create(self, validated_data):
        test_cases = validated_data.pop("test_cases", [])
        questions = validated_data.pop("questions", [])
        exercise = Exercise.objects.create(teacher=self.context["request"].user, **validated_data)
        TestCase.objects.bulk_create([TestCase(exercise=exercise, **case) for case in test_cases])
        Question.objects.bulk_create([Question(exercise=exercise, **question) for question in questions])
        return exercise


class ExerciseReadSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    test_cases = TestCaseReadSerializer(many=True, read_only=True)
    questions = QuestionReadSerializer(many=True, read_only=True)

    class Meta:
        model = Exercise
        fields = ["id", "title", "description", "category", "level", "is_exam", "difficulty", "programming_language", "time_limit_minutes", "passing_score", "is_active", "teacher", "created_at", "test_cases", "questions"]


class SubmissionAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmissionAnswer
        fields = ["question", "student_answer", "is_correct", "score_awarded", "judge0_output"]
        read_only_fields = fields


class SubmissionSerializer(serializers.ModelSerializer):
    test_results = serializers.SerializerMethodField()
    answers = SubmissionAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Submission
        fields = ["id", "exercise", "student", "code_submitted", "status", "score", "total_score", "max_possible_score", "percentage", "passed", "execution_time", "submitted_at", "error_message", "test_results", "answers"]
        read_only_fields = ["id", "student", "status", "execution_time", "score", "submitted_at"]

    def get_test_results(self, instance):
        return SubmissionTestResultSerializer(instance.test_results.all(), many=True).data


class SubmissionTestResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubmissionTestResult
        fields = ["id", "test_case", "passed", "status", "actual_output", "execution_time", "error_message"]
        read_only_fields = fields


class CourseSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)

    class Meta:
        model = Course
        fields = ["id", "code", "name", "description", "teacher", "created_at"]
        read_only_fields = ["id", "teacher", "created_at"]


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ["id", "course", "exercise", "title", "starts_at", "due_at", "time_limit_minutes", "created_at"]
        read_only_fields = ["id", "created_at"]


class CourseMembershipSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)

    class Meta:
        model = CourseMembership
        fields = ["id", "course", "student", "joined_at"]
        read_only_fields = fields


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "exercise", "sender", "receiver", "message_text", "created_at"]
        read_only_fields = fields
