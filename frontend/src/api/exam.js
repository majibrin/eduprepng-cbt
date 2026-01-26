import api from "./client";
import { getCSRFToken } from "./csrf";

export async function startAttempt(examId) {
  const res = await api.post(
    "attempts/start/",
    { exam_id: examId },
    {
      headers: {
        "X-CSRFToken": getCSRFToken(),
      },
    }
  );
  return res.data;
}
