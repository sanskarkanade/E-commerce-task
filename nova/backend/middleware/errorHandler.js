// Runs when a route does not exist.
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// Centralized error handler: every error in the API ends up here.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Server error';

  if (err.name === 'CastError') {
    // e.g. an invalid product ID such as /api/products/abc
    status = 400;
    message = err.path === '_id' ? 'Invalid ID format' : `Invalid value for "${err.path}"`;
  } else if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join('. ');
  } else if (err.code === 11000) {
    status = 409;
    message = 'A record with this value already exists';
  } else if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON in request body';
  }

  if (status === 500) {
    console.error(err); // log the real error on the server
    if (process.env.NODE_ENV === 'production') message = 'Something went wrong on the server';
  }

  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
