const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Protect admin dashboard route
router.get("/dashboard", authenticateToken, requireAdmin, (req, res) => {
  res.render("admin/dashboard", {
    title: "Admin Dashboard",
    nav: [], // add nav items here if needed
    user: req.user,
  });
});

module.exports = router;
