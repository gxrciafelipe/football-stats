/**
 * Loading and error states, so the user never stares at a blank page (NFR-4).
 */
export default function StatusMessage({ status, error, onRetry }) {
  if (status === 'loading') {
    return (
      <p className="status status--loading" role="status">
        <span className="spinner" aria-hidden="true" /> Loading zones…
      </p>
    );
  }
  if (status === 'error') {
    return (
      <div className="status status--error" role="alert">
        <p>
          <strong>Couldn’t load the pitch.</strong> {error?.message}
        </p>
        <button type="button" className="button" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }
  return null;
}
