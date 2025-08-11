const utilities = require("../utilities");

async function buildDashboard(req, res, next) {
  try {
    const nav = await utilities.getNav();
    // Add any admin stats here if needed
    res.render("admin/dashboard", {
      title: "Admin Dashboard",
      nav,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildDashboard,
};
