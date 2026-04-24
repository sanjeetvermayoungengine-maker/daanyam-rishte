type StepIndicatorProps = {
  current: number;
  total?: number;
  label?: string;
};

export function StepIndicator({ current, total = 7, label }: StepIndicatorProps) {
  const percent = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="step-indicator" aria-label={`Step ${current} of ${total}`}>
      <div className="step-indicator__row">
        <span>{label ?? `Step ${current} of ${total}`}</span>
        <span>{percent}%</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
