// Express 4 does not catch errors thrown in async handlers.
// This wrapper forwards them to the centralized error handler.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
