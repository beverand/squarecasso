var express = require('express');
var router = express.Router();
const mainController = require('../controllers/mainController')
const authController = require('../controllers/auth')
const {ensureAuth, ensureGuest} = require("../middleware/auth")

/* GET home page. */
router.get('/', mainController.getIndex);

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

router.get('/signin', authController.getLogin);
router.post('/signin', authController.postLogin);

router.get('/help', function(req, res, next) {
  res.render('help', { title: 'Squarecasso' });
});

module.exports = router;
