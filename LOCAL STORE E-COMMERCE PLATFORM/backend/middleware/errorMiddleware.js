// Basic error handling middleware (beginner-friendly)

function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message || "Server error",
    // In production, you usually don't expose stack traces.
    // For beginners, it's helpful in development.
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
}

module.exports = { notFound, errorHandler };

