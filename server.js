require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set('layout', 'layouts/layout');

app.use(expressLayouts);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Controllers
const baseController = require("./controllers/baseController");

// Routes
const accountRoutes = require("./routes/accountRoute");
const inventoryRoutes = require("./routes/inventoryRoute");
const adminRoutes = require("./routes/admin");

// Home route
app.get("/", baseController.buildHome);

// Feature routes
app.use("/account", accountRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/admin", adminRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).render("404", {
    title: "404 - Not Found",
    nav: [],
    errors: null,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  res.status(500).render("500", {
    title: "500 - Server Error",
    message: err.message,
    nav: [],
    errors: null,
  });
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});

module.exports = app;
