var express = require('express');
/*var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');*/
var cors = require('cors');

var routes = require('./routes/index');
var products = require('./routes/products');

var app = express();
app.set('view engine', '');
app.use(cors());

// set up postgres
var pg = require('pg');
var conString = "postgres://postgres:@localhost/testdb";
var pgclient = new pg.Client(conString);
pgclient.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
});
app.set('pgclient', pgclient); 

app.use('/', routes);
// TODO: add an account route
// but also just a header/cookie parser to limit requests to the current logged-in user
app.use('/products', products);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
