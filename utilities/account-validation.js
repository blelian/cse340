const { body, validationResult } = require("express-validator");

// Email validator function for tests and elsewhere
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

const registerRules = () => {
  return [
    body("first_name").trim().isLength({ min: 1 }).withMessage("First name is required."),
    body("last_name").trim().isLength({ min: 1 }).withMessage("Last name is required."),
    body("email").isEmail().withMessage("Valid email required."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  ];
};

const loginRules = () => {
  return [
    body("email").isEmail().withMessage("Valid email required."),
    body("password").notEmpty().withMessage("Password is required."),
  ];
};

function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = req.nav || [];
    return res.status(400).render(`account/${req.path.includes("login") ? "login" : "register"}`, {
      title: req.path.includes("login") ? "Login" : "Register",
      nav,
      errors: errors.array(),
    });
  }
  next();
}

module.exports = { registerRules, loginRules, checkValidation, validateEmail };
