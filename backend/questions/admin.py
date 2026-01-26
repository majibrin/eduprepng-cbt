from django.contrib import admin
from .models import Question, ExamAttempt, StudentAnswer


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "text",
        "exam",
        "subject",
        "year",
        "marks",
    )

    list_filter = (
        "exam",
        "subject",
        "year",
    )

    search_fields = (
        "text",
    )


@admin.register(ExamAttempt)
class ExamAttemptAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "exam",
        "status",
        "start_time",
        "expires_at",
        "end_time",
        "score",
    )

    list_filter = (
        "status",
        "exam",
    )


@admin.register(StudentAnswer)
class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "attempt",
        "question",
        "selected_option",
        "is_correct",
        "answered_at",
    )

    list_filter = (
        "is_correct",
    )
