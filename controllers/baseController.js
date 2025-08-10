// controllers/baseController.js
const utils = require("../utilities");

async function buildHome(req, res, next) {
  try {
    const nav = await utils.getNav();
    res.render("index", {
      title: "Home",
      nav,
      errors: null,
    });
  } catch (error) {
    console.error("Error building home page:", error);
    next(error);
  }
}

module.exports = { buildHome };
