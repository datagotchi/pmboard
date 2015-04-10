var express = require('express');
var router = express.Router();
var oauth = require('oauthio');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// TODO: fix cookie-based auth at some point, but use these (VERY INSECURE) routes for now

var User;
router.use(function(req, res, next) {
  User = req.app.get('User');
  next();
});

// TODO: get list of users (e.g., for typeahead.js suggestions to share your project)

// get user document via email
router.get('/:user_id', function(req, res, next) {
  
  if (!req.params.user_id) {
    var err = new Error("Invalid request; please specify user ID");
    err.status = 400;
    next(err);
  }
  var userid = req.params.user_id
  
  if (userid != req.app.get('userid')) {
    var err = new Error("Unauthorized");
    err.status = 401;
    next(err);
  }
  
  User.findById(userid)
    .populate('products', 'name')
    .exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        var err = new Error("No such user");
        err.status = 404;
        next(err);
      }
      return res.json(user);
    });
});

// change user
// - currentProduct
// - add product access
// - TODO: change email address
router.post('/:user_id', function(req, res, next) {
  
  var userid = req.params.user_id;
  
  if (userid != req.app.get('userid')) {
    var err = new Error("Unauthorized");
    err.status = 401;
    next(err);
  }
  
  User.findOne({_id: ObjectId(userid)}, function(err, user) {
    if (err) {
      return next(err);
    }
    
    if (req.body.currentProduct) {
      user.currentProduct = req.body.currentProduct;
    }
    
    if (req.body.product_id) { // TODO: hacky; put in users.products.post below
      user.products.push(req.body.product_id);
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
// - TODO: add accessible product (move from above route to here)
// - TODO: remove accessible product
/*router.post('/:user_email/products/:product_id', function(req, res, next) {
  var email = req.params.user_email;
  
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
      if (user.products[i]._id === req.params.product_id) {
        found = true;
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
});*/

// - TODO: remove product access (DELETE)

module.exports = router;