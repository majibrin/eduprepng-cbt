import { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import Pagination from "./components/Pagination";
import { examApi } from "./hooks/useExamApi";
import useExamTimer from "./hooks/useExamTimer";

function App() {
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [expiresAt, setExpiresAt] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");

  /* TIMER (AUTO-SUBMIT ON EXPIRE) */
  const timeLeft = useExamTimer(expiresAt, () => {
    if (!submitted) submitExam();
  });

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  /* ---------------- API ACTIONS ---------------- */

  const startExam = async () => {
    const res = await examApi.startExam(1);
    setAttemptId(res.data.attempt_id);
    setExpiresAt(res.data.expires_at);
    setStatus("Exam started ✅");
  };

  const loadQuestions = async () => {
    const res = await examApi.loadQuestions(attemptId);
    setQuestions(res.data);
    setCurrentIndex(0);
    setStatus(`Loaded ${res.data.length} questions ✅`);
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
    setStatus(`COMPLETED ✅ | Score: ${res.data.score}`);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>EduPrep CBT Exam</h2>

      {timeLeft !== null && (
        <h3>⏱ Time Left: {formatTime(timeLeft)}</h3>
      )}

      <p>
        Answered: {Object.keys(answers).length} / {questions.length}
      </p>

      {!attemptId && (
        <button onClick={startExam}>Start Exam</button>
      )}

      {attemptId && questions.length === 0 && (
        <button onClick={loadQuestions}>Load Questions</button>
      )}

      <pre>{status}</pre>

      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          selectedOption={answers[currentQuestion.id]}
          onSelect={selectAnswer}
          disabled={submitted}
          index={currentIndex}
          total={questions.length}
        />
      )}

      {questions.length > 0 && (
        <Pagination
          current={currentIndex}
          total={questions.length}
          onPrev={() => setCurrentIndex((i) => i - 1)}
          onNext={() => setCurrentIndex((i) => i + 1)}
          onSubmit={submitExam}
          disabled={submitted}
        />
      )}
    </div>
  );
}

export default App;
