require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const jwt = require("jsonwebtoken");

const { requireAdmin, authenticateToken } = require("./middleware/auth");
const utils = require("./utilities"); // for getNav()

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware (for flash messages)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key_here",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 }, // 10 minutes
  })
);

app.use(flash());

// Middleware to authenticate JWT from cookie and attach user to req
app.use((req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    req.user = null;
    return next();
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      req.user = null;
      res.clearCookie("jwt");
    } else {
      req.user = decoded;
    }
    next();
  });
});

// Middleware to expose flash messages and user info globally to views
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

  res.locals.user = req.user || null;

  if (typeof res.locals.useFormsCSS === "undefined") {
    res.locals.useFormsCSS = false;
  }
  if (typeof res.locals.bodyClass === "undefined") {
    res.locals.bodyClass = "";
  }

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
const accountRoutes = require("./routes/accountRoute");
const inventoryRoutes = require("./routes/inventoryRoute");
const adminRoutes = require("./routes/admin");
const adminInventoryRoutes = require("./routes/adminInventory");
const errorRoutes = require("./routes/errorRoute"); // <-- Added

// Home route
app.get("/", baseController.buildHome);

// Public routes
app.use("/account", accountRoutes);

// Protected routes
app.use("/inventory", authenticateToken, inventoryRoutes);

// Admin routes
app.use("/admin", authenticateToken, requireAdmin, adminRoutes);
app.use("/admin/inventory", authenticateToken, requireAdmin, adminInventoryRoutes);

// Error testing route
app.use("/error", errorRoutes);

// 404 handler
app.use(async (req, res, next) => {
  const nav = await utils.getNav().catch(() => []);
  res.status(404).render("errors/404", {
    title: "404 - Not Found",
    message: "Page not found",
    nav,
    errors: null,
    useFormsCSS: false,
    bodyClass: "error-404",
  });
});

// Global error handler
app.use(async (err, req, res, next) => {
  console.error("❌ Global Error:", err);
  const nav = await utils.getNav().catch(() => []);
  res.status(err.status || 500).render("errors/500", {
    title: "500 - Server Error",
    message: err.message || "Internal Server Error",
    nav,
    errors: null,
    useFormsCSS: false,
    bodyClass: "error-500",
  });
});

module.exports = app;
