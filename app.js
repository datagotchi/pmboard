var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
//var csrf = require('csurf');
//var cors = require('cors');
var mongoose = require('mongoose');
//var routes = require('./routes/index');
var products = require('./routes/products');
var oauth_route = require('./routes/oauth');
var oauth = require('oauthio');

var app = express();

var db = mongoose.createConnection("mongodb://localhost/pmboard");
var userSchema = require('./schema/User.js');
User = db.model('User', userSchema);
app.set('User', User);
var productSchema = require('./schema/Product.js');
Product = db.model('Product', productSchema);
app.set('Product', Product);

app.use(express.static('public'));
//app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: false
}));
//app.use(csrf());
/*app.use(function(req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.locals.csrftoken = req.csrfToken();
  next();
});*/

app.use('/oauth', oauth_route);

app.use('/users', require('./routes/users'));

app.use('/products', products);

/* Error Handlers */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    return res.status(err.status || 500).json({
      message: err.message,
      error: err
    });
  });
// }

// production error handler
// no stacktraces leaked to user
/*
app.use(function(err, req, res, next) {
  return res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});
*/


module.exports = app;
