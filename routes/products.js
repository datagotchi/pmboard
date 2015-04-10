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
// disabled, INSECURE
/*router.get('/', function(req, res, next) {
	Product.find(function(err, products) {
  	if (!err) {
      return res.json(products);
    } else {
      return next(err);
    }
  });
});*/

// add product
router.put('/', function(req, res, next) {
  var newprod = new Product({
    name: 'NewProduct',
    personas: [],
    permissions: {}
  });
  newprod.permissions[req.app.get('userid')] = 10;
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
      Product.findById(product_id, function(err, product) {
        var userid = req.app.get('userid');
        if (!(userid in product.permissions) || product.permissions[userid] < 1) {
          var err = new Error("Unauthorized");
          err.status = 401;
          next(err);
        }
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
  var userid = req.app.get('userid');
  if (!(userid in prod.permissions) || prod.permissions[userid] < 2) {
    var err = new Error("Unauthorized");
    err.status = 401;
    next(err);
  }
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
  var userid = req.app.get('userid');
  return res.json(req.product);
});

// delete product
router.delete('/:product_id', function(req, res, next) {
  var userid = req.app.get('userid');
  if (!(userid in req.product.permissions) || req.product.permissions[userid] < 3) {
    var err = new Error("Unauthorized");
    err.status = 401;
    next(err);
  }
  var prodId = req.product._id;
  var prodUsers = Object.keys(req.product.permissions);
  req.product.remove(function() {
    req.app.get('User').find({_id: {$in: prodUsers}}, function(err, users) {
      if (!err && users) {
        for (var j = 0; j < users.length; j++) {
          var user = removeUserProduct(users[j], prodId);
          return user.save(function(err) {
            if (err) {
              return next(err);
            } 
          });
        }
        return res.json({
          success: true
        });
      } else if (err) {
        return next(err);
      } else {
        next("Oops! Something went wrong!");
      }
    });
  });
});

function removeUserProduct(user, prodId) {
  var index = -1;
  for (var i = 0; i < user.products.length; i++) {
    if (user.products[i] === prodId) {
      index = i;
    }
  }
  if (index >= 0) user.products.splice(index, 1);
  if (user.currentProduct >= user.products.length) {
    user.currentProduct = user.products.length - 1;
  }
  return user;
}

router.use('/:product_id/personas', require('./personas'));

module.exports = router;