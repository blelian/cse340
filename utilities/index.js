// utils/index.js
const utilities = {};
const { getNav } = require('./nav');
const pool = require('../database'); // Needed for classification dropdown

utilities.getNav = getNav;

utilities.buildDetailGrid = async function (data) {
  if (!data) {
    return '<p>Sorry, no vehicle details found.</p>';
  }

  return `
    <section class="vehicle-detail">
      <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${data.inv_model}">
      <div class="vehicle-info">
        <h2>${data.inv_make} ${data.inv_model} (${data.inv_year})</h2>
        <p><strong>Price:</strong> $${Number(data.inv_price).toLocaleString()}</p>
        <p><strong>Description:</strong> ${data.inv_description}</p>
        <p><strong>Color:</strong> ${data.inv_color}</p>
        <p><strong>Mileage:</strong> ${Number(data.inv_miles).toLocaleString()} miles</p>
      </div>
    </section>
  `;
};

// Build the classification dropdown
utilities.getClassificationDropdown = async function () {
  const data = await pool.query('SELECT * FROM classification ORDER BY classification_name');
  let options = '<option value="">Select a classification</option>';
  data.rows.forEach(classification => {
    options += `<option value="${classification.classification_id}">${classification.classification_name}</option>`;
  });
  return `<select name="classification_id" id="classification_id" required>${options}</select>`;
};

module.exports = utilities;
