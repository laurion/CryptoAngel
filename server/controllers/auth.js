
const User = require('../models/user.js');

module.exports = (app, passport) => {

  app.get('/online', (req, res) => {
    if (req.user) {
      req.flash('info', 'You are online');
    }
    else {
      req.flash('info', 'You are not online');
    }

    return res.redirect('/');
  });

  app.post('/auth/signin', (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signin');
    }

    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err); }

      if (!user) {
        req.flash('errors', info.msg);
        return res.redirect('/signin');
      }

      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash('success', 'Success! You are logged in.');
        res.redirect('/');
      });
    })(req, res, next);
  });

  app.post('/auth/signup', (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('organizationName', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm-p', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/signup');
    }

    const user = new User();
    user.email = req.body.email;
    user.profile.organizationName = req.body.organizationName;
    user.password = user.generateHash(req.body.password);

    User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) { return next(err); }

      if (existingUser) {
        req.flash('errors', 'Account with that email address already exists.');
        return res.redirect('/signup');
      }

      user.save((err) => {
        if (err) { return next(err); }

        req.logIn(user, (err) => {
          if (err) { return next(err); }

          res.redirect('/');
        });
      });
    });
  });

  app.get('/auth/signout', (req, res) => {
    req.logout();
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err);
      req.user = null;
      res.redirect('/');
    });
  });
};
