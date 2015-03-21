var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var routes = require('./routes/index');
var products = require('./routes/products');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost/products");
//var db = mongoose.connection;
//app.set('db', db); 
var productSchema = new mongoose.Schema({
  name: String,
  personas: Array
});
var Product = mongoose.model('Product', productSchema);
app.set('Product', Product);

//app.use('/', routes);
// TODO: add an account route
// but also just a header/cookie parser to limit requests to the current logged-in user
app.use('/products', products);

// error handlers

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
