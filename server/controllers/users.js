
const User = require('../models/user.js');

module.exports = (app, passport) => {

  app.post('/signin', (req, res, next) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
      return res.redirect('/login');
    }

    passport.authenticate('local', (err, user, next) => {
      if (err) { return next(err); }

      if (!user) {
        return res.redirect('/login');
      }

      req.logIn(user, (err) => {
        if (err) { return next(err); }

        res.redirect(req.session.returnTo || '/');
      });
    })(req, res, next);
  });


  app.post('/auth/signup', (req, res, next) => {

    req.assert('email', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    req.assert('confirm-p', 'Passwords do not match').equals(req.body.password);
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    console.log({
      email: req.body.email,
      password: req.body.password
    });

    console.log(errors);

    if (errors) {
      return res.status(400).json({ errors });
    }

    const user = new User({
      email: req.body.email,
      password: req.body.password
    });

    User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) { return next(err); }

      if (existingUser) {
        return res.redirect('/signup');
      }

      user.save((err) => {
        if (err) { return next(err); }

        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }

          res.redirect('/');
        });

      });
    });

    passport.authenticate('local', (err, user, next) => {
      if (err) { return next(err); }

      if (!user) {
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }

        res.redirect('/');
      });
    })(req, res, next);

  });
};
