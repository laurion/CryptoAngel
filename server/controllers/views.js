module.exports = (app) => {
  app.get('/', (req, res) => {
    const authenticated = (req.user) ? true : false;
    console.log(authenticated);
    res.render('index.html', { user_authenticated: authenticated });
  });

  app.get('/signin', (req, res) => {
    const authenticated = (req.user) ? true : false;
    res.render('signin.html', { user_authenticated: authenticated });
  });

  app.get('/signup', (req, res) => {
    const authenticated = (req.user) ? true : false;
    res.render('signup.html', { user_authenticated: authenticated });
  });

  app.get('/listing', (req, res) => {
    const authenticated = (req.user) ? true : false;
    res.render('products.html', { user_authenticated: authenticated });
  });

  app.get('/howitworks', (req, res) => {
    const authenticated = (req.user) ? true : false;
    res.render('services.html', { user_authenticated: authenticated });
  });

  app.get('/about', (req, res) => {
    const authenticated = (req.user) ? true : false;
    res.render('about.html', { user_authenticated: authenticated });
  });

  app.get('/contact', (req, res) => {
    const authenticated = (req.user) ? true : false;
    res.render('contact.html', { user_authenticated: authenticated });
  });

  app.get('/detailpage', (req, res) => {
    const authenticated = (req.user) ? true : false;
    res.render('detailpage.html', { user_authenticated: authenticated });
  });
};
