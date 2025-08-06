// server.js
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pool = require('./database'); // your DB connection pool
const flash = require('connect-flash');
const expressMessages = require('express-messages');

const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const errorRoute = require('./routes/errorRoute');
const homeRoute = require('./routes/home');
const accountRoute = require('./routes/accountRoute');  // Added for account
const errorHandler = require('./middleware/errorHandler');

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware with PostgreSQL session store
app.use(
  session({
    store: new pgSession({
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
  })
);

// Flash messages
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', homeRoute);
app.use('/inventory', inventoryRoute);
app.use('/account', accountRoute); // Added account routes
app.use('/error', errorRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).render('errors/404', {
    title: '404 Not Found',
    message: 'Sorry, the page you requested does not exist.',
  });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
