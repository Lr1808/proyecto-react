from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import Assignment, Course, CourseMembership, User
from api.permissions import IsTeacher
from api.serializers import AssignmentSerializer, CourseMembershipSerializer, CourseSerializer


@api_view(["GET", "POST"])
def courses(request):
    if request.method == "POST":
        if not IsTeacher().has_permission(request, None):
            return Response({"detail": IsTeacher.message}, status=status.HTTP_403_FORBIDDEN)
        serializer = CourseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course = serializer.save(teacher=request.user)
        return Response(CourseSerializer(course).data, status=status.HTTP_201_CREATED)
    queryset = Course.objects.select_related("teacher").order_by("-created_at")
    return Response(CourseSerializer(queryset, many=True).data)


@api_view(["POST"])
def join_course(request, course_id):
    if request.user.role != User.Role.STUDENT:
        return Response({"detail": "Solo los estudiantes pueden unirse a cursos."}, status=status.HTTP_403_FORBIDDEN)
    course = get_object_or_404(Course, id=course_id)
    membership, _ = CourseMembership.objects.get_or_create(course=course, student=request.user)
    return Response(CourseMembershipSerializer(membership).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "POST"])
def assignments(request, course_id):
    course = get_object_or_404(Course, id=course_id)
    if request.method == "POST":
        if request.user != course.teacher:
            return Response({"detail": "Solo el profesor del curso puede crear asignaciones."}, status=status.HTTP_403_FORBIDDEN)
        serializer = AssignmentSerializer(data={**request.data, "course": course.id})
        serializer.is_valid(raise_exception=True)
        assignment = serializer.save()
        return Response(AssignmentSerializer(assignment).data, status=status.HTTP_201_CREATED)
    queryset = Assignment.objects.filter(course=course).select_related("exercise").order_by("due_at", "id")
    return Response(AssignmentSerializer(queryset, many=True).data)