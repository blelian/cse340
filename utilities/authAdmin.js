// utilities/authAdmin.js

function checkLogin(req, res, next) {
  if (req.session && req.session.account) {
    return next();
  }
  req.flash('error', 'You must be logged in to access this page.');
  res.redirect('/account/login');
}

function checkAdmin(req, res, next) {
  // Example: check if account has isAdmin flag (adjust as your schema)
  if (req.session && req.session.account && req.session.account.isAdmin) {
    return next();
  }
  req.flash('error', 'You do not have permission to access this page.');
  res.redirect('/');
}

module.exports = {
  checkLogin,
  checkAdmin,
};
