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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /* SELECTION STATE - Snake case to match Django */
  const [selection, setSelection] = useState({
    exam_type: "",
    subject: "",
    year: "2024",
  });

  /* TIMER */
  const timeLeft = useExamTimer(expiresAt, () => {
    if (!submitted && attemptId) submitExam();
  });

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  /* ================= API LOGIC ================= */

  const startExamFlow = async () => {
    setError(null);
    setLoading(true);
    setStatus("Checking availability...");

    try {
      // 1. Start the attempt with the selection object
      const startRes = await examApi.startExam(selection);
      const newAttemptId = startRes.data.attempt_id;
      
      setAttemptId(newAttemptId);
      setExpiresAt(startRes.data.expires_at);

      // 2. Automatically load questions for this attempt
      setStatus("Fetching questions...");
      const qRes = await examApi.loadQuestions(newAttemptId);
      
      setQuestions(qRes.data);
      setCurrentIndex(0);
      setStatus("");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to start exam. Make sure the selection exists in the database.";
      setError(errorMsg);
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = async (qid, option) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: option }));

    try {
      await examApi.submitAnswer({
        attempt: attemptId,
        question: qid,
        selected_option: option,
      });
    } catch (err) {
      console.error("Answer sync failed");
    }
  };

  const submitExam = async () => {
    if (submitted || !attemptId) return;
    setSubmitted(true);
    setStatus("Calculating results...");

    try {
      const res = await examApi.submitExam(attemptId);
      const total = questions.length;
      const answered = Object.keys(answers).length;
      const correct = res.data.score;

      setResult({
        score: correct,
        total,
        answered,
        correct,
        wrong: answered - correct,
        skipped: total - answered,
        percentage: Math.round((correct / total) * 100),
      });
    } catch (err) {
      setError("Error submitting results.");
      setSubmitted(false);
    }
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
    setError(null);
  };

  /* ================= RENDER LOGIC ================= */

  if (result) {
    return (
      <div className="result-page">
        <ResultPage result={result} onRestart={restartExam} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <h2 className="exam-title">EduPrep CBT</h2>

      {/* ERROR FEEDBACK */}
      {error && (
        <div className="status" style={{ border: '1px solid #ff5252', color: '#ff5252', background: '#ffebee' }}>
          ⚠️ {error}
          <button onClick={() => setError(null)} style={{width: 'auto', padding: '4px 8px', marginLeft: '10px', background: '#ff5252', color: 'white', borderRadius: '4px'}}>Dismiss</button>
        </div>
      )}

      {/* 1. SETUP SCREEN */}
      {!attemptId && (
        <div className="setup-container">
          <div className="status">Select your exam parameters</div>
          
          <div className="setup-form">
            <label>Exam Category</label>
            <select 
              className="option"
              value={selection.exam_type}
              onChange={(e) => setSelection({...selection, exam_type: e.target.value})}
            >
              <option value="">-- Choose Category --</option>
              <option value="JAMB">JAMB (UTME)</option>
              <option value="WAEC">WAEC (SSCE)</option>
              <option value="NECO">NECO</option>
            </select>

            <label>Subject</label>
            <select 
              className="option"
              value={selection.subject}
              onChange={(e) => setSelection({...selection, subject: e.target.value})}
            >
              <option value="">-- Choose Subject --</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">Use of English</option>
              <option value="Biology">Biology</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
            </select>

            <label>Year</label>
            <select 
              className="option"
              value={selection.year}
              onChange={(e) => setSelection({...selection, year: e.target.value})}
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>

            <button 
              className="primary-btn" 
              style={{marginTop: '20px'}}
              onClick={startExamFlow}
              disabled={!selection.exam_type || !selection.subject || loading}
            >
              {loading ? "Starting..." : "Begin Examination"}
            </button>
          </div>
        </div>
      )}

      {/* 2. EXAM INTERFACE */}
      {attemptId && (
        <>
          {timeLeft !== null && (
            <div className={`timer ${timeLeft < 60 ? "danger" : ""}`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          )}

          {status && <div className="status">{status}</div>}

          {questions.length > 0 && (
            <>
              <QuestionCard
                question={questions[currentIndex]}
                selectedOption={answers[questions[currentIndex].id]}
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
        </>
      )}
    </div>
  );
}

export default App;