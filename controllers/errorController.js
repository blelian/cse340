function triggerError(req, res, next) {
  const error = new Error('This is an intentional error for testing');
  error.status = 500; // Optional: explicitly set status
  next(error); // Pass error to Express error handler middleware
}

module.exports = { triggerError };
