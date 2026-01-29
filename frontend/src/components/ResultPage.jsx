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
    <div className="result-container">
      <h2 className="exam-title">Exam Result</h2>

      <div className="result-score">
        {score} / {total}
      </div>

      <p className="result-percentage">
        Percentage: <strong>{percentage}%</strong>
      </p>

      <ul className="result-stats">
        <li>
          <span>Answered</span>
          <strong>{answered}</strong>
        </li>
        <li>
          <span>Correct</span>
          <strong>{correct}</strong>
        </li>
        <li>
          <span>Wrong</span>
          <strong>{wrong}</strong>
        </li>
        <li>
          <span>Skipped</span>
          <strong>{skipped}</strong>
        </li>
      </ul>

      <div className="result-actions">
        <button className="primary-btn" onClick={onRestart}>
          Take Another Exam
        </button>
      </div>
    </div>
  );
}

export default ResultPage;