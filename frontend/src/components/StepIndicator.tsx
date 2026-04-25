type StepIndicatorProps = {
  current: number;
  total?: number;
  label?: string;
};

const stepLabels = ["Personal", "Photos", "Family", "Kundli", "Template", "Review"];

export function StepIndicator({ current, total = 6, label }: StepIndicatorProps) {
  const percent = Math.min(100, Math.round((current / total) * 100));
  const safeCurrent = Math.min(total, Math.max(1, current));
  const activeLabel = label ?? stepLabels[safeCurrent - 1] ?? `Step ${safeCurrent}`;

  return (
    <div className="step-indicator" aria-label={`Step ${current} of ${total}`}>
      <div className="step-indicator__row">
        <span>{`Step ${safeCurrent} of ${total} - ${activeLabel}`}</span>
        <span>{percent}%</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <ol className="step-indicator__steps" aria-hidden="true">
        {stepLabels.slice(0, total).map((stepLabel, index) => {
          const stepNumber = index + 1;
          const isDone = stepNumber < safeCurrent;
          const isActive = stepNumber === safeCurrent;
          const itemClassName = [
            "step-indicator__step",
            isDone ? "step-indicator__step--done" : "",
            isActive ? "step-indicator__step--active" : ""
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={stepLabel} className={itemClassName}>
              <span className="step-indicator__connector" />
              <span className="step-indicator__dot">{isDone ? "✓" : stepNumber}</span>
              <span className="step-indicator__label">{stepLabel}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
