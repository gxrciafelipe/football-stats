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

/**
 * Last middleware in the chain. Turns every error into
 * { error: { code, message, details? } } so clients only ever parse one shape (NFR-4).
 */
// eslint-disable-next-line no-unused-vars -- Express needs the 4-argument signature
export function errorHandler(err, _req, res, _next) {
  const status = err instanceof ApiError ? err.status : 500;
  if (status >= 500) console.error(err);

  const body = {
    error: {
      code: err instanceof ApiError ? err.code : 'INTERNAL_ERROR',
      message: status >= 500 ? 'Something went wrong on our side.' : err.message,
    },
  };
  if (err.details) body.error.details = err.details;
  res.status(status).json(body);
}
