from django.contrib import admin
from .models import Exam


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "duration_minutes",
    )

    list_filter = (
        "duration_minutes",
    )

    search_fields = (
        "name",
    )
