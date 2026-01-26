from django.db import models
from django.conf import settings
from django.utils import timezone
from exams.models import Exam
from subjects.models import Subject


class Question(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name="questions")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()

    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)

    correct_option = models.CharField(
        max_length=1,
        choices=[("A", "A"), ("B", "B"), ("C", "C"), ("D", "D")]
    )

    marks = models.PositiveIntegerField(default=1)
    year = models.PositiveIntegerField()

    def __str__(self):
        return self.text[:50]


class ExamAttempt(models.Model):
    STATUS_CHOICES = [
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("expired", "Expired"),
    ]

    # ✅ FIX IS HERE
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)

    start_time = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="in_progress")
    score = models.PositiveIntegerField(default=0)

    def has_expired(self):
        return timezone.now() >= self.expires_at

    def is_active(self):
        return self.status == "in_progress" and not self.has_expired()

    def complete(self):
        self.status = "completed"
        self.end_time = timezone.now()
        self.save()


class StudentAnswer(models.Model):
    attempt = models.ForeignKey(ExamAttempt, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    selected_option = models.CharField(
        max_length=1,
        choices=[("A", "A"), ("B", "B"), ("C", "C"), ("D", "D")]
    )

    is_correct = models.BooleanField(default=False)
    answered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("attempt", "question")

    def save(self, *args, **kwargs):
        self.is_correct = self.selected_option == self.question.correct_option
        super().save(*args, **kwargs)
