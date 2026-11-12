/**
 * Error raised on purpose by our own code. Carries an HTTP status and a stable,
 * machine-readable code so the client can react to specific failures.
 */
export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/** Unknown /api route: answer with the shared JSON error shape instead of HTML. */
export function notFound(req, _res, next) {
  next(new ApiError(404, 'NOT_FOUND', `No route for ${req.method} ${req.originalUrl}`));
}

/** Default codes for 4xx errors raised by Express itself or its middleware (static files, body parser). */
const HTTP_CODES = { 400: 'BAD_REQUEST', 404: 'NOT_FOUND', 413: 'PAYLOAD_TOO_LARGE' };

/**
 * Last middleware in the chain. Turns every error into
 * { error: { code, message, details? } } so clients only ever parse one shape (NFR-4).
 * Unexpected errors become a 500 whose details stay in the server log, never in the response.
 */
// eslint-disable-next-line no-unused-vars -- Express needs the 4-argument signature
export function errorHandler(err, _req, res, _next) {
  let status = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Something went wrong on our side.';

  if (err instanceof ApiError) {
    ({ status, code, message } = err);
  } else if (err.status >= 400 && err.status < 500) {
    status = err.status;
    code = HTTP_CODES[status] ?? 'BAD_REQUEST';
    message = err.expose ? err.message : 'The request could not be processed.';
  } else {
    console.error(err);
  }

  const body = { error: { code, message } };
  if (err instanceof ApiError && err.details) body.error.details = err.details;
  res.status(status).json(body);
}
