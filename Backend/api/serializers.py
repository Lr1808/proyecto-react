from rest_framework import serializers

from .models import ChatMessage, Exercise, Submission, TestCase, User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "password", "full_name", "role"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name", "role", "created_at"]
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


class ExerciseWriteSerializer(serializers.ModelSerializer):
    test_cases = TestCaseWriteSerializer(many=True, required=False)

    class Meta:
        model = Exercise
        fields = ["id", "title", "description", "difficulty", "programming_language", "teacher", "created_at", "test_cases"]
        read_only_fields = ["id", "teacher", "created_at"]

    def create(self, validated_data):
        test_cases = validated_data.pop("test_cases", [])
        exercise = Exercise.objects.create(teacher=self.context["request"].user, **validated_data)
        TestCase.objects.bulk_create([TestCase(exercise=exercise, **case) for case in test_cases])
        return exercise


class ExerciseReadSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)
    test_cases = TestCaseReadSerializer(many=True, read_only=True)

    class Meta:
        model = Exercise
        fields = ["id", "title", "description", "difficulty", "programming_language", "teacher", "created_at", "test_cases"]


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ["id", "exercise", "student", "code_submitted", "status", "execution_time", "score", "submitted_at"]
        read_only_fields = ["id", "student", "status", "execution_time", "score", "submitted_at"]


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "exercise", "sender", "receiver", "message_text", "created_at"]
        read_only_fields = fields
