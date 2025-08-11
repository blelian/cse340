const jwt = require("jsonwebtoken");

// Verify JWT, attach user info to req.user
function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect("/account/login");
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.clearCookie("jwt");
    return res.redirect("/account/login");
  }
}

// Only admins allowed
function requireAdmin(req, res, next) {
  if (req.user && req.user.role && req.user.role.toLowerCase() === "admin") {
    return next();
  }
  res.status(403).render("errors/403", {
    title: "403 - Unauthorized",
    nav: [],
    errors: [{ msg: "Access denied. Admins only." }],
  });
}

module.exports = { authenticateToken, requireAdmin };
