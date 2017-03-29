const express       = require('express');
const path          = require('path');
const favicon       = require('serve-favicon');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
var cors = require('cors');
const layouts       = require('express-ejs-layouts');
const mongoose      = require('mongoose');
const session       = require("express-session");
const bcrypt        = require("bcrypt");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User          = require('./models/user.js');
const ensureLogin   = require("connect-ensure-login");
const flash         = require("connect-flash");
var users = require('./routes/users');
require('./configs/database');
var bidsApi = require('./routes/bids-api');

// mongoose.connect(process.env.MONGODB_URI);

mongoose.connect('mongodb://localhost/llpages');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(layouts);
app.use(cors());
//express-session config
app.use(session({
  secret: "our-passport-local-strategy-app",
  resave: true,
  saveUninitialized: true
}));

app.use(flash());

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      next(err);
    } else if (!user) {
      next(null, false, { message: "Incorrect username" });
    } else if (!bcrypt.compareSync(password, user.password)) {
      next(null, false, { message: "Incorrect password" });
    } else {
      next(null, user);
    }
  });
}));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ "_id": id }, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));

app.use(passport.initialize());
app.use(passport.session());

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth-routes');
app.use('/', authRoutes);

app.use('/users', users);
app.use('/api', bidsApi);

app.use(function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
