from rest_framework.permissions import BasePermission


class IsTeacher(BasePermission):
    message = "Solo los profesores pueden realizar esta acción."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "teacher")
