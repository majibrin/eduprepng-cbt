from django.urls import path
from .api_views import (
    start_attempt,
    attempt_questions,
    submit_answer,
    attempt_status,
    submit_attempt,
)

urlpatterns = [
    path("attempts/start/", start_attempt),
    path("attempts/<int:attempt_id>/questions/", attempt_questions),
    path("attempts/<int:attempt_id>/status/", attempt_status),
    path("attempts/<int:attempt_id>/submit/", submit_attempt),
    path("answers/submit/", submit_answer),
]
