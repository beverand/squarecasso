module.exports = {
    getIndex: (req, res, next) => {
        res.render('index', { title: 'Squarecasso' });
  },
};
  
//   router.get('/signup', function(req, res, next) {
//     res.render('signup', { title: 'Squarecasso' });
//   });
  
//   router.get('/signin', function(req, res, next) {
//      res.render('signin', { title: 'Squarecasso' });
//   });
  
//   router.get('/help', function(req, res, next) {
//     res.render('help', { title: 'Squarecasso' });
//   });