
const User = require('../models/user.js');

module.exports = (app) => {
  app.post('/profile', (req, res, next) => {
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

        user.email = req.body.email || user.email;
        user.walletId = req.body.walletId || user.walletId;
        user.profile.organizationName = req.body.organizationName || user.profile.organizationName;
        user.profile.phoneNumber = req.body.phoneNumber || user.profile.phoneNumber;
        user.profile.orgType = req.body.orgType || user.profile.orgType;
        user.profile.description = req.body.description || user.profile.description;
        user.profile.picture = req.body.picture || user.profile.picture;
        user.profile.website = req.body.website || user.profile.website;

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
