function Pagination({
  current,
  total,
  onPrev,
  onNext,
  onSubmit,
  disabled,
}) {
  const isFirst = current === 0;
  const isLast = current === total - 1;

  return (
    <div className="pagination">
      <button
        className="secondary-btn"
        onClick={onPrev}
        disabled={isFirst || disabled}
      >
        Prev
      </button>

      {!isLast && (
        <button onClick={onNext} disabled={disabled}>
          Next
        </button>
      )}

      {isLast && (
        <button
          className="primary-btn"
          onClick={onSubmit}
          disabled={disabled}
        >
          Submit
        </button>
      )}
    </div>
  );
}

export default Pagination;
