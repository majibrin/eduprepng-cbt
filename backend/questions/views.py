from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import json

from .models import ExamAttempt, Question, StudentAnswer
from exams.models import Exam


@csrf_exempt
@login_required
@require_POST
def start_attempt(request):
    print("🔥 start_attempt HIT 🔥")

    data = json.loads(request.body)
    exam_id = data.get("exam_id")

    exam = get_object_or_404(Exam, id=exam_id)

    attempt = ExamAttempt.objects.create(
        student=request.user,
        exam=exam
    )

    return JsonResponse({
        "attempt_id": attempt.id,
        "status": attempt.status
    })


@login_required
@require_GET
def attempt_questions(request, attempt_id):
    attempt = get_object_or_404(
        ExamAttempt,
        id=attempt_id,
        student=request.user
    )

    questions = attempt.exam.questions.all()

    payload = []
    for q in questions:
        payload.append({
            "id": q.id,
            "text": q.text,
            "options": {
                "A": q.option_a,
                "B": q.option_b,
                "C": q.option_c,
                "D": q.option_d,
            },
            "marks": q.marks,
        })

    return JsonResponse(payload, safe=False)


@login_required
@require_GET
def attempt_status(request, attempt_id):
    attempt = get_object_or_404(
        ExamAttempt,
        id=attempt_id,
        student=request.user
    )

    return JsonResponse({
        "status": attempt.status,
        "score": attempt.score
    })


@csrf_exempt
@login_required
@require_POST
def submit_answer(request):
    data = json.loads(request.body)

    attempt = get_object_or_404(
        ExamAttempt,
        id=data["attempt"],
        student=request.user
    )

    if not attempt.is_active():
        return JsonResponse({"detail": "Attempt not active"}, status=400)

    question = get_object_or_404(Question, id=data["question"])

    answer, _ = StudentAnswer.objects.update_or_create(
        attempt=attempt,
        question=question,
        defaults={"selected_option": data["selected_option"]}
    )

    return JsonResponse({
        "question": question.id,
        "is_correct": answer.is_correct
    })


@csrf_exempt
@login_required
@require_POST
def submit_attempt(request, attempt_id):
    attempt = get_object_or_404(
        ExamAttempt,
        id=attempt_id,
        student=request.user
    )

    if not attempt.is_active():
        return JsonResponse({"detail": "Already submitted"}, status=400)

    score = 0
    for ans in attempt.answers.all():
        if ans.is_correct:
            score += ans.question.marks

    attempt.score = score
    attempt.complete()

    return JsonResponse({
        "status": attempt.status,
        "final_score": attempt.score
    })
