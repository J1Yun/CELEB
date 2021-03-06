// imports
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);
const expressLayouts = require('express-ejs-layouts');
dotenv.config();

const app = express();

// Static files
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/src/public/css'));
app.use('/js', express.static(__dirname + '/src/public/js'));
app.use('/img', express.static(__dirname + '/src/public/img'));

// Templating Engine
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);

app.set('layout', 'consumer/layout');

app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new FileStore({ logFn: function () {} }),
    cookie: {
      Secure: true,
    },
  }),
);

app.use(function (req, res, next) {
  if (req.session.user) res.locals.user = req.session.user;
  else res.locals.user = undefined;
  if (req.session.store) res.locals.store = req.session.store;
  else res.locals.store = undefined;
  next();
});

// Routes
const consumer = require('./src/routes/consumer');
app.use('/', consumer);

const seller = require('./src/routes/seller');
app.use('/s', seller);

module.exports = app;
