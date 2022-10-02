var express = require('express');
var router = express.Router();
const mainController = require('../controllers/mainController')
const authController = require('../controllers/auth')
const {ensureAuth, ensureGuest} = require("../middleware/auth")

/* GET home page. */
router.get('/', mainController.getIndex);

router.get('/signup', mainController.getSignup);
router.post('/signup', authController.postSignup);

router.get('/signin', mainController.getSignin);
router.post('/signin', authController.postLogin);

router.get('/logout', authController.logout);

router.get('/help', mainController.getHelp);

module.exports = router;
