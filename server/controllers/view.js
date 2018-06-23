
module.exports = (app, passport) => {

  app.get('/', (req, res) => {
    res.render('index.html', {
      users: [{ url: 'http://google.com', username: 'OdinTech' }]
    });
  });

  app.get('/signin', (req, res) => {
    res.render('signin.html');
  });

  app.get('/signup', (req, res) => {
    res.render('signup.html');
  });

  app.get('/listing', (req, res) => {
    res.render('products.html');
  });

  app.get('/howitworks', (req, res) => {
    res.render('services.html');
  });

  app.get('/about', (req, res) => {
    res.render('about.html');
  });

  app.get('/contact', (req, res) => {
    res.render('contact.html');
  });

  app.get('/detailpage', (req, res) => {
    res.render('detailpage.html');
  });
};
