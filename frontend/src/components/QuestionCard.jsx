function QuestionCard({
  question,
  selectedOption,
  onSelect,
  disabled,
  index,
  total,
}) {
  return (
    <div className="question-card">
      <h4>
        Question {index + 1} / {total}
      </h4>

      <div className="question-text">{question.text}</div>

      <ul className="options">
        {Object.entries(question.options).map(([key, value]) => (
          <li
            key={key}
            className={`option ${
              selectedOption === key ? "selected" : ""
            }`}
            onClick={() => !disabled && onSelect(question.id, key)}
          >
            <input
              type="radio"
              checked={selectedOption === key}
              disabled={disabled}
              readOnly
            />
            <span>
              {key}. {value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QuestionCard;
