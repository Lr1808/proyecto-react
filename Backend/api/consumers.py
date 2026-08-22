import json
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import ChatMessage, Exercise, User


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.exercise_id = self.scope["url_route"]["kwargs"]["exercise_id"]
        self.target_user_id = self.scope["url_route"]["kwargs"]["target_user_id"]
        self.user = self.scope.get("user")
        if not self.user or self.user.is_anonymous:
            await self.close(code=4401)
            return
        allowed = await self.can_chat()
        if not allowed:
            await self.close(code=4403)
            return
        self.room_group_name = f"chat_{self.exercise_id}_{min(self.user.id, int(self.target_user_id))}_{max(self.user.id, int(self.target_user_id))}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        message_text = str(content.get("message", "")).strip()
        if not message_text or len(message_text) > 5000:
            await self.send_json({"error": "El mensaje debe tener entre 1 y 5000 caracteres."})
            return
        message = await self.save_message(message_text)
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "chat.message", "message": message},
        )

    async def chat_message(self, event):
        await self.send_json(event["message"])

    @sync_to_async
    def can_chat(self):
        exercise = Exercise.objects.select_related("teacher").get(id=self.exercise_id)
        target = User.objects.get(id=self.target_user_id)
        return (self.user.role == User.Role.TEACHER and exercise.teacher_id == self.user.id and target.role == User.Role.STUDENT) or (
            self.user.role == User.Role.STUDENT and target.id == exercise.teacher_id
        )

    @sync_to_async
    def save_message(self, message_text):
        receiver = User.objects.get(id=self.target_user_id)
        message = ChatMessage.objects.create(
            exercise_id=self.exercise_id,
            sender=self.user,
            receiver=receiver,
            message_text=message_text,
        )
        return {"id": message.id, "sender_id": self.user.id, "receiver_id": receiver.id, "message": message.message_text, "created_at": message.created_at.isoformat()}
