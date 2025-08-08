// server.js
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

// Load env variables
require('dotenv').config();

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const flash = require('connect-flash');
const expressMessages = require('express-messages');

const pool = require('./database'); // PostgreSQL pool connection

// Controllers & routes
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const errorRoute = require('./routes/errorRoute');
const homeRoute = require('./routes/home');
const accountRoute = require('./routes/accountRoute');

// Middleware
const errorHandler = require('./middleware/errorHandler');

app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Request parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware with PostgreSQL store
app.use(
  session({
    store: new pgSession({
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: 'sessionId',
    cookie: {
      secure: false, // change to true if HTTPS
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);

// Flash messages middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res);
  // Make logged-in account available to views if present
  res.locals.account = req.session.account || null;
  next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', homeRoute);
app.use('/inventory', inventoryRoute);
app.use('/inv', inventoryRoute);
app.use('/account', accountRoute);
app.use('/error', errorRoute);

// 404 catch-all handler
app.use((req, res) => {
  res.status(404).render('errors/404', {
    title: '404 Not Found',
    message: 'Sorry, the page you requested does not exist.',
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
