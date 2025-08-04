// utilities/index.js
const pool = require('../database');
const { getNav } = require('./nav');

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
      grid += `<a href="/inventory/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
      // Use thumbnail image here for classification grid
      grid += `<img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" /></a>`;
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += `<h2><a href="/inventory/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">`;
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

// Classification dropdown builder (for Add Inventory form)
utilities.getClassificationDropdown = async function () {
  const data = await pool.query('SELECT * FROM classification ORDER BY classification_name');
  let options = '<option value="">Select a classification</option>';
  data.rows.forEach(classification => {
    options += `<option value="${classification.classification_id}">${classification.classification_name}</option>`;
  });
  return `<select name="classification_id" id="classification_id" required>${options}</select>`;
};

module.exports = utilities;
