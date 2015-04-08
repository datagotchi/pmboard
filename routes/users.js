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
// - TODO: remove product access
// - TODO: update product name (from product db)
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

module.exports = router;