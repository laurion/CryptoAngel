
const User = require('../models/user.js');

module.exports = (app) => {
  app.put('/profile', (req, res, next) => {
    req.assert('email', 'Please enter a valid email address.').isEmail();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/profile');
    }

    process.nextTick(() => {
      User.findById(req.user.id, (err, user) => {
        if (err) { return next(err); }
        user.email = req.body.email || '';
        user.walletId = req.body.walletId || '';
        user.profile.contactName = req.body.contactName || '';
        user.profile.type = req.body.type || '';
        user.profile.description = req.body.description || '';
        user.profile.picture = req.body.picture || '';
        user.profile.description = req.bod.description || '';
        user.save((err) => {
          if (err) {
            if (err.code === 11000) {
              req.flash('warning', 'The email address you have entered is already associated with an account.');
              return res.redirect('/profile');
            }
            return next(err);
          }

          req.flash('success', 'Profile information has been updated.');
          res.redirect('/profile');
        });
      });
    });
  });
};
