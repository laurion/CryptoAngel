const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');


const User = require('../models/user.js');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (err) { return done(err); }

    if (!user) { return done(null, false, { msg: `Email: ${email} not found.` }); }

    if (!user.validPassword(password)) {
      return done(null, false, { msg: 'Invalid email or password.' });
    }

    return done(null, user);
  });
}));
