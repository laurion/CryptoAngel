const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');


const app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
