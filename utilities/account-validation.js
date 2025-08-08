// utilities/account-validation.js
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/accountModel"); // Import your model to check emails

const validate = {};

// Validation rules for registration inputs
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name with at least 2 characters."),

    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (email) => {
        const existingAccount = await accountModel.getAccountByEmail(email);
        if (existingAccount) {
          // Reject with message if email already exists
          return Promise.reject("An account with that email already exists.");
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password does not meet requirements (min 12 chars, 1 number, 1 uppercase, 1 special char)."
      ),
  ];
};

// Middleware to check validation results and render errors if any
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.status(400).render("account/register", {
      errors,
      title: "Register",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
  next();
};

module.exports = validate;
