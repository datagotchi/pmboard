var express = require('express');
var router = express.Router();
var oauth = require('oauthio');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// TODO: fix cookie-based auth at some point, but use these (VERY INSECURE) routes for now

var db = mongoose.createConnection("mongodb://localhost/users");
var schema = require('../schema/User.js');
var User = db.model('User', schema);

// TODO: get list of users (e.g., for typeahead.js suggestions to share your project)

// get user document via email
router.get('/:user_email', function(req, res, next) {
  
  var email = req.params.user_email
  
  User.findOne({email: email}, function(err, user) {
    if (err) {
      return next(err);
    }
    return res.json(user);
  });
});

// change user
// - currentProduct
// - add product access
// - TODO: change email address
router.post('/:user_email', function(req, res, next) {
  
  var email = req.params.user_email;
  
  User.findOne({email: email}, function(err, user) {
    if (err) {
      return next(err);
    }
    
    if (req.body.currentProduct) {
      user.currentProduct = req.body.currentProduct;
    }
    
    if (req.body.name && req.body.id) {
      user.products.push({
        name: req.body.name,
        id: req.body.id
      });
    }
    
    return user.save(function(err) { // TODO: turn into its own route so I can use next(...) to save a document?
      if (err) { // TODO: convert to next(err)?
        return res.json({
          success: false,
          error: err
        });
      } else {
        return res.json({
          success: true
        });
      }
    });
  });
});

// change a record of an accessible product
// - TODO: update product name
router.post('/:user_email/:product_id', function(req, res, next) {
  var email = req.params.user_email;
  var newname = req.body.name;
  if (!newname) {
    var err = new Error("No new product name specified");
    err.status = 400;
    return next(err);
  }
  
  User.findOne({email: email}, function(err, user) {
    if (err) {
      return next(err);
    }
    
    var found = false;
    for (var i in user.products) {
      if (user.products[i].id === req.params.product_id) {
        found = true;
        user.products[i].name = newname;
      }
    }
    
    if (!found) {
      var err = new Error("Invalid product_id");
      err.status = 404;
      return next(err);
    }
    
    return user.save(function(err) { // TODO: turn into its own route so I can use next(...) to save a document?
      if (err) { // TODO: convert to next(err)?
        return res.json({
          success: false,
          error: err
        });
      } else {
        return res.json({
          success: true
        });
      }
    });
  });
});

// - TODO: remove product access (DELETE)

module.exports = router;