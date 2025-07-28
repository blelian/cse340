function triggerError(req, res) {
  throw new Error('This is an intentional error for testing');
}

module.exports = { triggerError };
