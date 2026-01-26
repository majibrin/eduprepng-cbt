from rest_framework import serializers
from .models import Question, ExamAttempt, StudentAnswer


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        # DO NOT expose correct_option in the student exam flow API
        fields = [
            "id", "exam", "subject", "text",
            "option_a", "option_b", "option_c", "option_d",
            "difficulty", "marks", "year"
        ]


class ExamAttemptSerializer(serializers.ModelSerializer):
    time_remaining_seconds = serializers.SerializerMethodField()

    class Meta:
        model = ExamAttempt
        fields = ["id", "exam", "status", "score", "start_time", "end_time", "time_remaining_seconds"]

    def get_time_remaining_seconds(self, obj):
        return obj.time_remaining_seconds()


class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = ["id", "attempt", "question", "selected_option", "is_correct", "answered_at"]
        read_only_fields = ["is_correct", "answered_at"]
