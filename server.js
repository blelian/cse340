require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware (required for flash messages)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key_here", // Use env var in production
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }, // optional session expiration (ms)
  })
);

// Flash middleware
app.use(flash());

// Middleware to expose flash messages function to views
app.use((req, res, next) => {
  res.locals.messages = () => {
    const flashes = req.flash();
    let html = "";
    for (const type in flashes) {
      flashes[type].forEach((msg) => {
        html += `<div class="flash-message ${type}">${msg}</div>`;
      });
    }
    return html;
  };
  next();
});

// Set up EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");

app.use(expressLayouts);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Controllers
const baseController = require("./controllers/baseController");

// Routes
const accountRoutes = require("./routes/accountRoute");
const inventoryRoutes = require("./routes/inventoryRoute");
const adminRoutes = require("./routes/admin");
const adminInventoryRoutes = require("./routes/adminInventory");

// Home route
app.get("/", baseController.buildHome);

// Feature routes
app.use("/account", accountRoutes);
app.use("/inventory", inventoryRoutes);

// Admin routes
app.use("/admin", adminRoutes); // dashboard, user management
app.use("/admin/inventory", adminInventoryRoutes); // inventory management

// 404 handler
app.use((req, res, next) => {
  res.status(404).render("errors/404", {
    title: "404 - Not Found",
    message: "Page not found",
    nav: [],
    errors: null,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err);
  res.status(500).render("errors/500", {
    title: "500 - Server Error",
    message: err.message,
    nav: [],
    errors: null,
  });
});

module.exports = app;
