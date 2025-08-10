// utilities/jwt-auth.js
const jwt = require("jsonwebtoken");

function checkJWTToken(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect("/account/login");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Error:", err.message);
      res.clearCookie("jwt");
      return res.redirect("/account/login");
    }
    req.user = decoded;
    next();
  });
}

module.exports = { checkJWTToken };
