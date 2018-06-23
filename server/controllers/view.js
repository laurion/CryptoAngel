
module.exports = (app, passport) => {

  app.get('/', (req, res) => {
    res.render('index.html', {
      users: [{ url: 'http://google.com', username: 'OdinTech' }]
    });
  });

  app.get('/signin', (req, res) => {
    res.render('signin.html');
  });
};
