import api from "../api/client";
import { getCSRFToken } from "../api/csrf";

const csrfHeader = () => ({
  headers: { "X-CSRFToken": getCSRFToken() },
});

export const examApi = {
  startExam(examId) {
    return api.post(
      "attempts/start/",
      { exam_id: examId },
      csrfHeader()
    );
  },

  loadQuestions(attemptId) {
    return api.get(`attempts/${attemptId}/questions/`);
  },

  submitAnswer(payload) {
    return api.post(
      "answers/submit/",
      payload,
      csrfHeader()
    );
  },

  submitExam(attemptId) {
    return api.post(
      `attempts/${attemptId}/submit/`,
      {},
      csrfHeader()
    );
  },
};
