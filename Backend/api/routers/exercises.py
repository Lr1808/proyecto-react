from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.models import Exercise
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

    queryset = Exercise.objects.select_related("teacher").prefetch_related("test_cases").order_by("-created_at")
    difficulty = request.query_params.get("difficulty")
    language = request.query_params.get("language")
    if difficulty:
        queryset = queryset.filter(difficulty=difficulty)
    if language:
        queryset = queryset.filter(programming_language=language)
    return Response(ExerciseReadSerializer(queryset, many=True, context={"request": request}).data)


@api_view(["GET"])
def exercise_detail(request, exercise_id):
    exercise = get_object_or_404(
        Exercise.objects.select_related("teacher").prefetch_related("test_cases"), id=exercise_id
    )
    return Response(ExerciseReadSerializer(exercise, context={"request": request}).data)
