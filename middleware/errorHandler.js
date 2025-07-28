function handleErrors(err, req, res, next) {
  console.error("❌ Global Error:", err.stack);

  res.status(500).render("errors/500", {
    title: "Server Error",
    message: "An unexpected error occurred.",
    error: err.message // Optional: remove or hide in production
  });
}

module.exports = handleErrors;
