var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const methodOverride = require('method-override');
const flash = require('express-flash');
const connectDB = require('./config/database');
var port = process.env.PORT;
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var signinRouter = require('./routes/signin');

var app = express();

//Use .env file in config
require('dotenv').config({path: './config/.env'});
require('./config/passport')(passport);

//connect to Database
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({mongooseConnection: mongoose.connection }),
  })
);

app.use(passport.initialize());
app.use(passport.session())

//use flash messages for errors
app.use(flash());


app.use('/', indexRouter);
// app.use('/signin', signinRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(port, () => {
//     console.log(`Express server listening on port 3005!`)
// });
module.exports = app;
