var express = require('express');
var router = express.Router();

// get products
router.get('/', function(req, res, next) {
	res.send('"hi there"');
});

// add product

// change product details

router.param('product_id', function(req, res, next, product_id) {
  // TODO: assert product_id is an integer
  
  var pgclient = req.app.get('pgclient');
  
  var query = pgclient.query({
	  text: 'select name from products where id=$1',
	  values: product_id
  });
  query.on('row', function(row) {
	  req.product = row;
	  next();
  });
  query.on('error', function(error) {
	  next(error);
  });
});

// get product
router.get('/:product_id', function(req, res, next) {
	var prod = req.product;
	res.json(prod);
});

module.exports = router;