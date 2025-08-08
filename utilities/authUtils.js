const jwt = require("jsonwebtoken");

function createJWT(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

function verifyJWT(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { createJWT, verifyJWT };
