/**
 * Thin wrapper around fetch for the Action Zones API.
 * Every failure (network down, 4xx, 5xx, bad JSON) becomes an ApiRequestError with a
 * message that is safe to show to users, so components only handle one error type.
 */

// Empty in production (the API serves the client from the same origin) and in development
// (Vite proxies /api). Set VITE_API_URL only if the API lives on another host.
const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export class ApiRequestError extends Error {
  constructor(message, { status = 0, code = 'NETWORK_ERROR' } = {}) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
  }
}

/**
 * GET a JSON resource from the API.
 * @param {string} path e.g. "/api/zones?metric=passes"
 * @param {{ signal?: AbortSignal }} [options]
 */
export async function apiGet(path, { signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      signal,
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiRequestError('Could not reach the server. Check your connection and try again.');
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON body (e.g. a proxy error page); handled below
  }

  if (!response.ok) {
    throw new ApiRequestError(body?.error?.message ?? `Request failed (${response.status}).`, {
      status: response.status,
      code: body?.error?.code ?? 'HTTP_ERROR',
    });
  }
  if (body === null) {
    throw new ApiRequestError('The server sent an unexpected response.', {
      status: response.status,
      code: 'BAD_RESPONSE',
    });
  }
  return body;
}

/** Builds the zones URL from the selected metric and grid size. */
export function zonesPath({ metric, cols, rows }) {
  const params = new URLSearchParams({ metric, cols: String(cols), rows: String(rows) });
  return `/api/zones?${params}`;
}
