function triggerError(req, res, next) {
  // Intentionally throw an error to test middleware
  throw new Error('This is an intentional 500 error triggered by the user.');
}

module.exports = { triggerError };
