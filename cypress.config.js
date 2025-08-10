// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5500', // your local server URL & port
    specPattern: 'cypress/e2e/**/*.spec.js', // where your tests live
    supportFile: false, // disable if you don't have a support file
  },
});
