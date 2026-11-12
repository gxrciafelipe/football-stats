import { useCallback, useEffect, useState } from 'react';
import { apiGet, zonesPath } from '../api/client.js';

/**
 * Loads zone leaders for a metric and grid size, refetching whenever they change.
 * An in-flight request is aborted when the inputs change or the component unmounts,
 * so a slow old response can never overwrite a newer one.
 *
 * @returns {{ status: 'loading'|'success'|'error', data: object|null, error: Error|null, retry: () => void }}
 */
export function useZones({ metric, cols, rows }) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    // Keep the previous data visible while the next metric loads
    setState((previous) => ({ ...previous, status: 'loading', error: null }));

    apiGet(zonesPath({ metric, cols, rows }), { signal: controller.signal })
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setState({ status: 'error', data: null, error });
      });

    return () => controller.abort();
  }, [metric, cols, rows, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
