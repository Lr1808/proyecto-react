from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import ChatMessage, Exercise, User
from api.serializers import ChatMessageSerializer, UserSerializer


@api_view(["GET", "POST"])
def chat_messages(request):
    user = request.user

    if request.method == "POST":
        target_user_id = request.data.get("target_user_id") or request.data.get("receiver_id")
        exercise_id = request.data.get("exercise_id")
        message_text = str(request.data.get("message_text", "")).strip()

        if not message_text:
            return Response({"detail": "El contenido del mensaje no puede estar vacío."}, status=status.HTTP_400_BAD_REQUEST)

        receiver = get_object_or_404(User, id=target_user_id) if target_user_id else None
        exercise = get_object_or_404(Exercise, id=exercise_id) if exercise_id else Exercise.objects.first()

        if not receiver:
            if user.role == User.Role.STUDENT and exercise and exercise.teacher:
                receiver = exercise.teacher
            else:
                receiver = User.objects.filter(role=User.Role.TEACHER if user.role == User.Role.STUDENT else User.Role.STUDENT).first()

        if not receiver:
            return Response({"detail": "No se encontró el usuario destinatario."}, status=status.HTTP_404_NOT_FOUND)

        msg = ChatMessage.objects.create(
            exercise=exercise,
            sender=user,
            receiver=receiver,
            message_text=message_text,
        )
        return Response(ChatMessageSerializer(msg).data, status=status.HTTP_201_CREATED)

    # GET: fetch messages between current user and target user/exercise
    target_user_id = request.query_params.get("target_user_id")
    exercise_id = request.query_params.get("exercise_id")

    queryset = ChatMessage.objects.filter(Q(sender=user) | Q(receiver=user)).select_related("sender", "receiver", "exercise")

    if target_user_id:
        queryset = queryset.filter(Q(sender_id=target_user_id) | Q(receiver_id=target_user_id))
    if exercise_id:
        queryset = queryset.filter(exercise_id=exercise_id)

    queryset = queryset.order_by("created_at")[:100]
    return Response(ChatMessageSerializer(queryset, many=True).data)


@api_view(["GET"])
def chat_contacts(request):
    user = request.user
    if user.role == User.Role.TEACHER:
        # Teachers can chat with students who sent submissions or messages
        contacts = User.objects.filter(role=User.Role.STUDENT).order_by("full_name")[:50]
    else:
        # Students can chat with teachers
        contacts = User.objects.filter(role=User.Role.TEACHER).order_by("full_name")[:50]

    return Response(UserSerializer(contacts, many=True).data)
