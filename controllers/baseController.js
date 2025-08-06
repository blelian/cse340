// controllers/baseController.js
const utils = require('../utilities/');

async function buildHome(req, res, next) {
  try {
    const nav = await utils.getNav();

    // Flash message removed after successful test

    res.render('index', {
      title: 'Home',
      nav,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { buildHome };
