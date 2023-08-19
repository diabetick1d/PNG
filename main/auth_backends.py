from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserModelBackend(BaseBackend):
    def authenticate(self, request, uid=None, **kwargs):
        try:
            return User.objects.get(uid=uid)
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None