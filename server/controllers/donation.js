const url = require('url');
const axios = require('axios');

module.exports = (app) => {

  app.post('/donate', (req, res) => {
    req.assert('companyEmail', 'Email is not valid').isEmail();
    req.assert('walletAddress', 'Provide a valid wallet address').notEmpty();
    console.log(req.body);
    console.log(req.body.now);
    console.log(req.body.later);
    const errors = req.validationErrors();
    console.log(errors);

    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/fha');
    }

    if (req.body.now) {
      req.flash('warning', 'now')
    }

    return res.redirect('/fha');
  });

  // app.get('/donate-history', (req, res) => {
  //   req.session.donationHistory = ['hello']
  //   return res.redirect(url.format({
  //     pathname: '/fha',
  //     query: {
  //       a: ['aw', 'sdf'],
  //       b: 2,
  //       valid: 'your string here'
  //     }
  //   }));

  // });

}