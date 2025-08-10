// controllers/baseController.js
const utils = require("../utilities");

async function buildHome(req, res, next) {
  try {
    // Build the navigation dynamically
    const nav = await utils.getNav();

    // Render the home page
    res.render("index", {
      title: "Home",
      nav,
      errors: null, // Prevents "errors is not defined" in index.ejs if it's referenced
    });
  } catch (error) {
    console.error("Error building home page:", error);
    next(error);
  }
}

module.exports = { buildHome };
