const jwt = require("jsonwebtoken");

// Middleware to verify JWT and attach user info to req.user
function authenticateToken(req, res, next) {
  const token = req.cookies.jwt; // Ensure your cookie name is 'jwt'

  if (!token) {
    return res.redirect("/account/login");
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; // Decoded token payload must have role, account_id, etc.
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.redirect("/account/login");
  }
}

// Middleware to check if user is an admin
function requireAdmin(req, res, next) {
  if (req.user && req.user.role && req.user.role.toLowerCase() === "admin") {
    next();
  } else {
    res.status(403).render("errors/403", {
      title: "403 - Unauthorized",
      nav: [],
      errors: [{ msg: "Access denied. Admins only." }],
    });
  }
}

// Middleware to check if user is an admin or employee
function requireAdminOrEmployee(req, res, next) {
  if (
    req.user &&
    req.user.role &&
    (req.user.role.toLowerCase() === "admin" || req.user.role.toLowerCase() === "employee")
  ) {
    next();
  } else {
    res.status(403).render("errors/403", {
      title: "403 - Unauthorized",
      nav: [],
      errors: [{ msg: "Access denied. Admins or Employees only." }],
    });
  }
}

module.exports = { authenticateToken, requireAdmin, requireAdminOrEmployee };
