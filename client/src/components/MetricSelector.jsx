/**
 * Segmented control for choosing the action metric (passes, shots, …).
 * Built from native radio buttons, so arrow keys, screen readers and forms work out of the box.
 */
export default function MetricSelector({ metrics, value, onChange, disabled }) {
  return (
    <fieldset className="metric-selector" disabled={disabled}>
      <legend>Action</legend>
      <div className="metric-selector__options">
        {metrics.map((metric) => (
          <label
            key={metric.id}
            className={`metric-selector__option${metric.id === value ? ' is-active' : ''}`}
          >
            <input
              type="radio"
              name="metric"
              value={metric.id}
              checked={metric.id === value}
              onChange={() => onChange(metric.id)}
            />
            {metric.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
