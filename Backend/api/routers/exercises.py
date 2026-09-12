from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.models import Exercise, User
from api.permissions import IsTeacher
from api.serializers import ExerciseReadSerializer, ExerciseWriteSerializer


@api_view(["GET", "POST"])
def exercises(request):
    if request.method == "POST":
        permission = IsTeacher()
        if not permission.has_permission(request, None):
            return Response({"detail": permission.message}, status=status.HTTP_403_FORBIDDEN)
        serializer = ExerciseWriteSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        exercise = serializer.save()
        return Response(ExerciseReadSerializer(exercise, context={"request": request}).data, status=status.HTTP_201_CREATED)

    queryset = Exercise.objects.select_related("teacher").prefetch_related("test_cases")
    if request.user.role == User.Role.STUDENT:
        queryset = queryset.filter(is_active=True)
    queryset = queryset.order_by("-created_at")
    difficulty = request.query_params.get("difficulty")
    language = request.query_params.get("language")
    category = request.query_params.get("category")
    level = request.query_params.get("level")
    is_exam = request.query_params.get("is_exam")
    if difficulty:
        queryset = queryset.filter(difficulty=difficulty)
    if language:
        queryset = queryset.filter(programming_language=language)
    if category:
        queryset = queryset.filter(category=category)
    if level:
        queryset = queryset.filter(level=level)
    if is_exam in {"true", "false"}:
        queryset = queryset.filter(is_exam=is_exam == "true")
    return Response(ExerciseReadSerializer(queryset, many=True, context={"request": request}).data)


@api_view(["GET"])
def exercise_detail(request, exercise_id):
    queryset = Exercise.objects.select_related("teacher").prefetch_related("test_cases")
    if request.user.role == User.Role.STUDENT:
        queryset = queryset.filter(is_active=True)
    exercise = get_object_or_404(queryset, id=exercise_id)
    return Response(ExerciseReadSerializer(exercise, context={"request": request}).data)
