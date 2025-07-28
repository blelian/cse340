const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv').config(); // Load .env config

const baseController = require('./controllers/baseController');
const inventoryRoute = require('./routes/inventoryRoute');
const errorRoute = require('./routes/errorRoute');
const errorHandler = require('./middleware/errorHandler');
const homeRoute = require('./routes/home');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', homeRoute);                 // Home and related pages
app.use('/inventory', inventoryRoute);  // Inventory routes
app.use('/error', errorRoute);          // Route to test error handling (remove after testing)

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).render('errors/404', {
    title: '404 Not Found',
    message: 'Sorry, the page you requested does not exist.',
  });
});

// Global error handler - must be last middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
