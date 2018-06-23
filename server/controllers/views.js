
module.exports = (app, passport) => {

  app.get('/', (req, res) => {
    res.render('index.html');
  });

  app.get('/signin', (req, res) => {
    res.render('signin.html');
  });

  app.get('/signup', (req, res) => {
    res.render('signup.html');
  });
};
