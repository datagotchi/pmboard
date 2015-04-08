var express = require('express');
var router = express.Router();
var oauth = require('oauthio');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var proddb = mongoose.createConnection("mongodb://localhost/products");
var productSchema = require('../schema/Product.js');
var Product = proddb.model('Product', productSchema);

// get products
router.get('/', function(req, res, next) {
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
  var newprod = new Product({
    //name: req.body.name,
    name: 'NewProduct',
    personas: []
  });
  return newprod.save(function(err) {
    if (err) { // TODO: convert to next(err)?
      return res.json({
        success: false,
        error: err
      });
    } else {
      return res.json({
        success: true,
        product: newprod
      });
    }
  });
});

router.param('product_id', function(req, res, next, product_id) {
  // TODO: assert product_id is an integer
  
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

// change product details
// - name
router.post('/:product_id', function(req, res, next) {
  var prod = req.product;
  if (req.body.value) { // x-editable sends pk, name, and value; just use value for now (later: make it more generic to change other product details?)
    prod.name = req.body.value;
  }
  return prod.save(function(err) {
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

// get product
router.get('/:product_id', function(req, res, next) {
  return res.json(req.product);
});

router.use('/:product_id/personas', require('./personas'));

module.exports = router;