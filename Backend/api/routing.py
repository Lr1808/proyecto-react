from django.urls import re_path

from .consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<exercise_id>\d+)/(?P<target_user_id>\d+)/$", ChatConsumer.as_asgi()),
]
