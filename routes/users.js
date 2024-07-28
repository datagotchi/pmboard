var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var ObjectId = mongoose.Types.ObjectId;

var User;
router.use(function (req, res, next) {
  User = req.app.get("User");
  next();
});

// TODO: get list of users (e.g., for typeahead suggestions to share your project)
// for <datalist> on the frontend

router.get("/:user_id", function (req, res, next) {
  if (!req.params.user_id) {
    var err = new Error("Invalid request; please specify user ID");
    err.status = 400;
    return next(err);
  }
  var paramUserId = req.params.user_id;
  //   var cookieUserId = JSON.parse(req.cookies.userid);
  //   var cookieUserId = req.cookies.userid;

  /*
  if (paramUserId != cookieUserId) {
    var err = new Error("Unauthorized");
    err.status = 401;
    return next(err);
  }
*/

  User.findById(paramUserId)
    .populate("products", "name")
    .then(function (user) {
      if (!user) {
        var err = new Error("No such user");
        err.status = 404;
        return next(err);
      }
      return res.json(user);
    })
    .catch(function (err) {
      if (err) {
        return next(err);
      }
    });
});

// change user
// - currentProduct
// - add product access
// - TODO: change email address
router.put("/:user_id", function (req, res, next) {
  var userid = req.params.user_id;

  /*
  if (userid != req.cookies.userid) {
    var err = new Error("Unauthorized");
    err.status = 401;
    return next(err);
  }
  */

  User.findById(userid)
    .then((user) => {
      if ("currentProduct" in req.body) {
        user.currentProduct = req.body.currentProduct;
      }

      if (req.body.product_id) {
        // TODO: hacky; put in users.products.post below
        user.products.push(req.body.product_id);
      }

      return user.save(function (err) {
        // TODO: turn into its own route so I can use next(...) to save a document?
        if (err) {
          // TODO: convert to next(err)?
          return next(err);
        } else {
          return res.json(user);
        }
      });
    })
    .catch((err) => {
      return next(err);
    });
});

// change a record of an accessible product
// - TODO: add accessible product (move from above route to here)
// - TODO: remove accessible product
/*router.put('/:user_email/products/:product_id', function(req, res, next) {
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
