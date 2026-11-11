import { vi } from 'vitest';
import { ApiError, errorHandler } from '../src/middleware/errorHandler.js';

// Minimal stand-in for an Express response object
function mockResponse() {
  const res = {};
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
}

describe('errorHandler middleware', () => {
  it('sends an ApiError with its status, code, message and details', () => {
    const res = mockResponse();
    const err = new ApiError(400, 'INVALID_QUERY', 'Bad input', [{ field: 'cols' }]);

    errorHandler(err, {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: 'INVALID_QUERY', message: 'Bad input', details: [{ field: 'cols' }] },
    });
  });

  it('hides internal details of unexpected errors behind a 500', () => {
    const res = mockResponse();
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    errorHandler(new Error('database exploded'), {}, res, () => {});

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: 'INTERNAL_ERROR', message: 'Something went wrong on our side.' },
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
