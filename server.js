const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const dotenv = require('dotenv');
const chalk = require('chalk');
const path = require('path');
const passport = require('passport');
const errorHandler = require('errorhandler');
const logger = require('morgan');
const jinja = require('nunjucks');

/**
 * Controllers
 */
const viewCtrl = require('./controllers/views.js');
const authCtrl = require('./controllers/auth.js');
const userCtrl = require('./controllers/user-detail.js');
const donationCtrl = require('./controllers/donation.js');
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

const BASE_DIR = path.dirname(__dirname);
const VIEW_DIR = path.join(BASE_DIR, process.env.VIEW_DIR);


const app = express();


/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Configure Jinja (nunjunk) as view engine.
 */
jinja.configure(VIEW_DIR, {
  autoescape: true,
  watch: true,
  express: app
});

/**
 * Passport configuration.
 */
const passportConfig = require('./config/passport');

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(expressValidator());
app.use(express.static(path.join(BASE_DIR, 'public', 'static')));

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(logger('dev'));

/**
 * Initialize views routes
 */
viewCtrl(app);
userCtrl(app);
donationCtrl(app);
authCtrl(app, passport);

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler());
}


app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});


module.exports = app;
