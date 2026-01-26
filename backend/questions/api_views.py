import json
from datetime import timedelta

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.csrf import csrf_exempt

from exams.models import Exam
from .models import ExamAttempt, Question, StudentAnswer


@csrf_exempt
@require_POST
def start_attempt(request):
    data = json.loads(request.body)
    exam_id = data.get("exam_id")

    exam = get_object_or_404(Exam, id=exam_id)

    now = timezone.now()
    expires_at = now + timedelta(minutes=exam.duration_minutes)

    attempt = ExamAttempt.objects.create(
        student=None,   # frontend phase
        exam=exam,
        expires_at=expires_at,
        status="in_progress",
    )

    return JsonResponse({
        "attempt_id": attempt.id,
        "status": attempt.status,
        "expires_at": attempt.expires_at,
    })


@csrf_exempt
@require_GET
def attempt_questions(request, attempt_id):
    attempt = get_object_or_404(ExamAttempt, id=attempt_id)

    if not attempt.is_active():
        return JsonResponse({"error": "Attempt not active"}, status=400)

    questions = attempt.exam.questions.all()

    return JsonResponse([
        {
            "id": q.id,
            "text": q.text,
            "options": {
                "A": q.option_a,
                "B": q.option_b,
                "C": q.option_c,
                "D": q.option_d,
            },
            "marks": q.marks,
        }
        for q in questions
    ], safe=False)


@csrf_exempt
@require_POST
def submit_answer(request):
    data = json.loads(request.body)

    attempt = get_object_or_404(ExamAttempt, id=data["attempt"])
    question = get_object_or_404(Question, id=data["question"])

    if not attempt.is_active():
        return JsonResponse({"error": "Attempt not active"}, status=400)

    answer, _ = StudentAnswer.objects.update_or_create(
        attempt=attempt,
        question=question,
        defaults={"selected_option": data["selected_option"]},
    )

    return JsonResponse({
        "question": question.id,
        "selected": answer.selected_option,
        "is_correct": answer.is_correct,
    })


@csrf_exempt
@require_GET
def attempt_status(request, attempt_id):
    attempt = get_object_or_404(ExamAttempt, id=attempt_id)

    return JsonResponse({
        "status": attempt.status,
        "score": attempt.score,
        "expired": attempt.has_expired(),
    })


@csrf_exempt
@require_POST
def submit_attempt(request, attempt_id):
    attempt = get_object_or_404(ExamAttempt, id=attempt_id)

    if attempt.status != "in_progress":
        return JsonResponse({"error": "Attempt already finished"}, status=400)

    attempt.score = attempt.answers.filter(is_correct=True).count()
    attempt.complete()

    return JsonResponse({
        "status": attempt.status,
        "score": attempt.score,
    })
