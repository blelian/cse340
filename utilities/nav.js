// utilities/nav.js
async function getNav() {
  return `
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/custom">Custom</a></li>
        <li><a href="/sedan">Sedan</a></li>
        <li><a href="/sport">Sport</a></li>
        <li><a href="/suv">SUV</a></li>
        <li><a href="/truck">Truck</a></li>
      </ul>
    </nav>
  `;
}

module.exports = { getNav };
