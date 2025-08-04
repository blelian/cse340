// ===============================
// server.js
// ===============================
const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const errorRoute = require('./routes/errorRoute');
const homeRoute = require('./routes/home');
const errorHandler = require('./middleware/errorHandler');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', homeRoute);
app.use('/inventory', inventoryRoute);
app.use('/error', errorRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('errors/404', {
    title: '404 Not Found',
    message: 'Sorry, the page you requested does not exist.'
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
