var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

// get products
router.get('/', function(req, res, next) {
	var Product = req.app.get('Product');
	Product.find(function(err, products) {
  	if (!err) {
      res.json(products);
    } else {
      next(err);
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
  Product.findById(product_id, function(err, product) {
    if (!err) {
      req.product = product;
      next();
    } else {
      next(err);
    }
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
  //var Product = req.app.get('Product');
  var prod = req.product;
  res.json(prod.personas);
});

// add user persona
router.put('/:product_id/personas', function(req, res, next) {
  var Product = req.app.get('Product');
  console.log("Product = ", Product);
  var prod = req.product;
  console.log("prod = ", prod);
  var newpersona = req.body.value;
  console.log("adding new persona: ", newpersona);
  //prod.update({_id: ObjectId("550cb3c96c2de13ab1cdd5fa")}, {$push: {personas: {name: newpersona}}});
  
  /*Product.findbyId(prod._id, function(err, product) {
    console.log("got product: ", product);
    product.personas.push(req.body.value);
    return product.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(product);
    });
  });*/
  
  prod.personas.push({name: newpersona});
  
  return prod.save(function(err) {
    if (err) {
      return res.json({
        success: false,
        error: err
      });
    } else {
      return res.json({
        success: true,
        product: prod
      });
    }
  });
});

// change user persona
router.post('/:product_id/personas/:persona_name', function(req, res, next) {
  var old_name = req.params.persona_name;
  // TODO: get new persona name & update db
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