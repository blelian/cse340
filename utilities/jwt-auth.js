// utilities/jwt-auth.js
const jwt = require("jsonwebtoken");

function checkJWTToken(req, res, next) {
  console.log("=== JWT Middleware: Checking for token ===");
  
  // Log all cookies to verify if the token cookie exists
  console.log("Cookies received:", req.cookies);

  const token = req.cookies.jwt;

  if (!token) {
    console.log("No JWT token found in cookies. Redirecting to login.");
    return res.redirect("/account/login");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      res.clearCookie("jwt");
      console.log("Cleared JWT cookie due to verification failure.");
      return res.redirect("/account/login");
    }
    
    console.log("JWT verified successfully. Decoded payload:", decoded);
    req.user = decoded;
    next();
  });
}

module.exports = { checkJWTToken };
