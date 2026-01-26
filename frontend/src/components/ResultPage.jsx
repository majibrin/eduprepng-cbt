function ResultPage({ result, onRestart }) {
  const {
    score,
    total,
    answered,
    correct,
    wrong,
    skipped,
    percentage,
  } = result;

  return (
    <div className="question-card">
      <h4>Exam Result</h4>

      <div
        className="question-text"
        style={{ fontSize: "2.5rem", textAlign: "center", fontWeight: "bold" }}
      >
        {score} / {total}
      </div>

      <p style={{ textAlign: "center", marginBottom: 20 }}>
        Percentage: <strong>{percentage}%</strong>
      </p>

      <ul className="options">
        <li className="option">
          <span>Answered</span>
          <strong>{answered}</strong>
        </li>
        <li className="option">
          <span>Correct</span>
          <strong>{correct}</strong>
        </li>
        <li className="option">
          <span>Wrong</span>
          <strong>{wrong}</strong>
        </li>
        <li className="option">
          <span>Skipped</span>
          <strong>{skipped}</strong>
        </li>
      </ul>

      <button className="primary-btn" onClick={onRestart}>
        Take Another Exam
      </button>
    </div>
  );
}

export default ResultPage;
