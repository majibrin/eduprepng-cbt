import { useState } from "react";
import "./App.css";

import QuestionCard from "./components/QuestionCard";
import Pagination from "./components/Pagination";
import ResultPage from "./components/ResultPage";

import { examApi } from "./hooks/useExamApi";
import useExamTimer from "./hooks/useExamTimer";

function App() {
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [expiresAt, setExpiresAt] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");

  /* TIMER */
  const timeLeft = useExamTimer(expiresAt, () => {
    if (!submitted) submitExam();
  });

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  /* ================= API ================= */

  const startExam = async () => {
    const res = await examApi.startExam(1);
    setAttemptId(res.data.attempt_id);
    setExpiresAt(res.data.expires_at);
    setStatus("Exam started");
  };

  const loadQuestions = async () => {
    const res = await examApi.loadQuestions(attemptId);
    setQuestions(res.data);
    setCurrentIndex(0);
    setStatus(`Loaded ${res.data.length} questions`);
  };

  const selectAnswer = async (qid, option) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: option }));

    await examApi.submitAnswer({
      attempt: attemptId,
      question: qid,
      selected_option: option,
    });
  };

  const submitExam = async () => {
    if (submitted) return;
    setSubmitted(true);

    const res = await examApi.submitExam(attemptId);

    const total = questions.length;
    const answered = Object.keys(answers).length;
    const correct = res.data.score;
    const wrong = answered - correct;
    const skipped = total - answered;
    const percentage = Math.round((correct / total) * 100);

    setResult({
      score: correct,
      total,
      answered,
      correct,
      wrong,
      skipped,
      percentage,
    });
  };

  const restartExam = () => {
    setAttemptId(null);
    setQuestions([]);
    setAnswers({});
    setExpiresAt(null);
    setCurrentIndex(0);
    setSubmitted(false);
    setResult(null);
    setStatus("");
  };

  const currentQuestion = questions[currentIndex];

  /* ================= RESULT PAGE ================= */
  if (result) {
    return (
      <div className="result-page">
        <ResultPage result={result} onRestart={restartExam} />
      </div>
    );
  }

  /* ================= EXAM PAGE ================= */
  return (
    <div className="app-container">
      <h2 className="exam-title">EduPrep CBT Exam</h2>

      {timeLeft !== null && (
        <div className={`timer ${timeLeft < 30 ? "danger" : ""}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      )}

      {status && <div className="status">{status}</div>}

      {!attemptId && (
        <button className="primary-btn" onClick={startExam}>
          Start Exam
        </button>
      )}

      {attemptId && questions.length === 0 && (
        <button className="primary-btn" onClick={loadQuestions}>
          Load Questions
        </button>
      )}

      {currentQuestion && (
        <>
          <QuestionCard
            question={currentQuestion}
            selectedOption={answers[currentQuestion.id]}
            onSelect={selectAnswer}
            disabled={submitted}
            index={currentIndex}
            total={questions.length}
          />

          <Pagination
            current={currentIndex}
            total={questions.length}
            disabled={submitted}
            onPrev={() => setCurrentIndex((i) => i - 1)}
            onNext={() => setCurrentIndex((i) => i + 1)}
            onSubmit={submitExam}
          />
        </>
      )}
    </div>
  );
}

export default App;
