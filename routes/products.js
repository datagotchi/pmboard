var express = require('express');
var router = express.Router();
var oauth = require('oauthio');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var Product;
router.use(function(req, res, next) {
  Product = req.app.get('Product');
  next();
});

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
  if (req.body.value) {
    prod.name = req.body.value;
  }
  return prod.save(function(err) {
    if (err) { // TODO: convert to next(err)?
      return res.json({
        success: false,
        error: err
      });
    } else {
      // TODO: change products in the users db ~ db.users.find({"products.id": "550cb3c96c2de13ab1cdd5fa"}) etc...
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