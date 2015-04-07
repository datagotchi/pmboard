var express = require('express');
var router = express.Router();
var oauth = require('oauthio');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// get products
router.get('/', function(req, res, next) {
	var Product = req.app.get('Product');
	Product.find(function(err, products) {
  	if (!err) {
      return res.json(products);
    } else {
      return next(err);
    }
  });
});

// add product
router.put('/', function(req, res, next) {
  var Product = req.app.get('Product');
  /*var newprod = new Product({
    name: 
  });
  newprod.save();
  */
});

// change product details

router.param('product_id', function(req, res, next, product_id) {
  // TODO: assert product_id is an integer
  
  var Product = req.app.get('Product');
  //oauth.auth('google', req.session)
  //.then(function (request_object) {
      // TODO: validate w/ req.session.email that they have access to the product
      Product.findById(product_id, function(err, product) {
        if (!err) {
          req.product = product;
          return next();
        } else {
          return next(err);
        }
      });
  //});
});

// get product
router.get('/:product_id', function(req, res, next) {
  //var prod = req.product;
  return res.json(req.product);
});

router.use('/:product_id/personas', require('./personas'));

module.exports = router;