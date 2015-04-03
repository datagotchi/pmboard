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
  //oauth.auth('google', req.session)
  //.then(function (request_object) {
      // TODO: validate w/ req.session.email that they have access to the product
      Product.findById(product_id, function(err, product) {
        if (!err) {
          req.product = product;
          next();
        } else {
          next(err);
        }
      });
  //});
});

// get product
router.get('/:product_id', function(req, res, next) {
  //var prod = req.product;
  res.json(req.product);
});

// ***** user personas *****

// get user personas
router.get('/:product_id/personas', function(req, res, next) {
  //var prod = req.product;
  res.json(req.product.personas);
});

// add user persona
router.put('/:product_id/personas', function(req, res, next) {
  var prod = req.product;
  var newpersona = req.body.value;
  
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
        personas: prod.personas
      });
    }
  });
});

// change user persona
router.post('/:product_id/personas', function(req, res, next) {
  var prod = req.product;
  var ix = req.body.pk;
  prod.personas.splice(ix, 1, {name: req.body.value});
    
  return prod.save(function(err) {
    if (err) {
      return res.json({
        success: false,
        error: err
      });
    } else {
      return res.json({
        success: true,
        personas: prod.personas
      });
    }
  });
});

// delete user persona
router.delete('/:product_id/personas', function(req, res, next) {
  var prod = req.product;
  if (req.body.ix) {
    var ix = req.body.ix;
    prod.personas.splice(ix, 1);
      
    return prod.save(function(err) {
      if (err || !prod) {
        return res.json({
          success: false,
          error: err
        });
      } else {
        return res.json({
          success: true,
          personas: prod.personas
        });
      }
    });
  }
 
  res.status(400);
  next('Invalid request; index not specified');
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