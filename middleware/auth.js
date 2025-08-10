const jwt = require("jsonwebtoken");

// Middleware to verify JWT and attach user info to req.user
function authenticateToken(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect("/account/login");
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // attach decoded token payload (account_id, email, role)
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.redirect("/account/login");
  }
}

// Middleware to check if user is admin
function requireAdmin(req, res, next) {
  if (req.user && req.user.role && req.user.role.toLowerCase() === "admin") {
    next();
  } else {
    res.status(403).render("403", {
      title: "403 - Unauthorized",
      nav: [],
      errors: [{ msg: "Access denied. Admins only." }],
    });
  }
}

module.exports = { authenticateToken, requireAdmin };
