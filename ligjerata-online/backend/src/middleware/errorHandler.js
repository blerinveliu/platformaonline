const AppError = require('../utils/AppError');

function notFound(req, res, next) {
  next(new AppError(`Rruga ${req.originalUrl} nuk u gjet`, 404));
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Gabim i brendshëm i serverit';

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Gabim:', err);
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = { notFound, errorHandler };