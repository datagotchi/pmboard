var express = require('express');
var router = express.Router();

// get products
router.get('/', function(req, res, next) {
	var pgclient = req.app.get('pgclient');
	var query = pgclient.query("select * from products", function(err, result) {
  	res.json(result.rows);
	});
});

// add product

// change product details

router.param('product_id', function(req, res, next, product_id) {
  // TODO: assert product_id is an integer
  
  var pgclient = req.app.get('pgclient');
  
  var query = pgclient.query({
	  text: 'select * from products where id=$1',
	  values: [product_id]
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

// ***** user personas *****

// get user personas
router.get('/:product_id/personas', function(req, res, next) {
  var pgclient = req.app.get('pgclient');
  var prod = req.product;
  var query = pgclient.query({
	  text: 'select * from personas where product_id=$1',
	  values: [req.product.id]
  }, function(err, result) {
	  if (err) next(err);
	  res.json(result.rows);
  });
});

// add user persona
router.put('/:product_id/personas', function(req, res, next) {
  var pgclient = req.app.get('pgclient');
  res.send('');
});

// change user persona
router.post('/:product_id/personas/:persona_name', function(req, res, next) {
  var type_name = req.params.type_name;
  res.send('');
});

/* // user data stuff
router.param('user_name', function(req, res, next, product_id) {
  // TODO: assert user_name is a normal string
  
  var pgclient = req.app.get('pgclient');
  
  var query = pgclient.query({
	  text: 'select * from products where id=$1',
	  values: [product_id]
  });
  query.on('row', function(row) {
	  req.product = row;
	  next();
  });
  query.on('error', function(error) {
	  next(error);
  });
});

// ****** user interviews *****

// get user interviews
router.get('/:user_name/interviews', function(req, res, next) {
  res.send('');
});

// add user interview
router.put('/:user_name/interviews', function(req, res, next) {
  res.send('');
});

// ***** user challenges ******

// get user challenges
router.get('/:user_name/challenges', function(req, res, next) {
  res.send('');
});

// add user challenge
router.put('/:user_name/challenges', function(req, res, next) {
  res.send('');
});

// change user challenge
router.post('/:user_name/challenges/:challenge_name', function(req, res, next) {
  res.send('');
});
*/


module.exports = router;