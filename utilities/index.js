const pool = require('../database');
const { getNav } = require('./nav');
const jwt = require("jsonwebtoken");

const utilities = {};

// Navigation HTML builder
utilities.getNav = getNav;

// Builds a vehicle listing grid from data
utilities.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => {
      const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(vehicle.inv_price);

      grid += '<li>';
      grid += `<a href="/inventory/details/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
      grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" /></a>`;
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += `<h2><a href="/inventory/details/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
      grid += `${vehicle.inv_make} ${vehicle.inv_model}</a></h2>`;
      grid += `<span>${formattedPrice}</span>`;
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

// Classification dropdown builder for management page
utilities.getClassificationDropdown = async function () {
  const data = await pool.query('SELECT * FROM classification ORDER BY classification_name');
  let options = '<option value="">Select a classification</option>';
  data.rows.forEach(classification => {
    options += `<option value="${classification.classification_id}">${classification.classification_name}</option>`;
  });
  return `<select name="classification_id" id="classificationList" required>${options}</select>`;
};

// Async error handler wrapper for controllers
utilities.handleErrors = function (fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// JWT login check middleware
utilities.checkLogin = (req, res, next) => {
  const token = req.cookies && req.cookies.jwt;

  if (!token) {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.accountData = decoded;
    res.locals.loggedin = true;
    next();
  } catch (err) {
    console.log("JWT verification error:", err);
    req.flash("notice", "Session expired. Please log in again.");
    return res.redirect("/account/login");
  }
};

module.exports = utilities;
