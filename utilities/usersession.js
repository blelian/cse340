const jwt = require("jsonwebtoken");

function addUserToLocals(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    res.locals.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.locals.user = null;
    } else {
      res.locals.user = decoded;  // e.g., { account_id, email, role }
    }
    next();
  });
}

module.exports = { addUserToLocals };
