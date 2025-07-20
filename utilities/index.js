// utils/index.js
const utilities = {};
const { getNav } = require('./nav');

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

module.exports = utilities;
