const pool = require('../database');

async function getNav() {
  const data = await pool.query('SELECT classification_id, classification_name FROM classification ORDER BY classification_name');
  let nav = '<ul id="nav-menu">';
  nav += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach(row => {
    nav += `<li><a href="/inventory/type/${row.classification_id}" title="View our ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
  });
  nav += '</ul>';
  return nav;
}

module.exports = { getNav };
