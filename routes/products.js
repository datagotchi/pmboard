import express from "express";
const router = express.Router();
// var mongoose = require("mongoose");
// var ObjectId = mongoose.Types.ObjectId;

// let Product;
// router.use(function (req, res, next) {
//   Product = req.app.get("Product");
//   next();
// });

// module.exports = function (router) {
// get products
// disabled, INSECURE
router.get("/", async (req, res, next) => {
  const products = await req.client
    .query("select * from products")
    .then((result) => result.rows);
  req.client.release();
  return res.json(products);
});

// // add product
// router.post("/", async (req, res, next) => {
//   const { name } = req.body;
//   var newprod = new Product({
//     name,
//     personas: [],
//     stories: [],
//     companies: [],
//     tasks: [],
//     permissions: {},
//   });
//   await Product.create(newprod);
//   // var userid = req.cookies.userid;
//   // console.log("*** userid: ", userid);
//   // newprod.permissions.push({
//   //   _id: userid,
//   //   value: 10,
//   // });

//   return res.json(newprod);
// });

router.param("product_id", async (req, res, next, product_id) => {
  //oauth.auth('google', req.session)
  //.then(function (request_object) {
  // const product = await Product.findById(product_id);
  req.product_id = product_id;
  // create loookup table for permissions (can't store it directly in the db, annoyingly)
  // var permLookup = {};
  // for (var i = 0; i < product.permissions.length; i++) {
  //   permLookup[product.permissions[i]._id] = product.permissions[i].value;
  // }
  // req.product.permLookup = permLookup;
  /*
          if (!(userid in req.product.permLookup) || req.product.permLookup[userid] < 1) {
            var err = new Error("Unauthorized");
            err.status = 401;
            return next(err);
          }
      */
  return next();
  //});
});

// // change product details
// // - name
// // router.put("/:product_id", function (req, res, next) {
// //   var prod = req.product;
// //   //   var userid = JSON.parse(req.cookies.userid);
// //   /*
// //   if (!(userid in req.product.permLookup) || req.product.permLookup[userid] < 2) {
// //     var err = new Error("Unauthorized");
// //     err.status = 401;
// //     return next(err);
// //   }
// // */
// //   if (req.body.name) {
// //     prod.name = req.body.name;
// //   }
// //   return prod.save(function (err) { // mongoose now uses promises, not callbacks
// //     if (err) {
// //       next(err);
// //     } else {
// //       // TODO: change products in the users db ~ db.users.find({"products.id": "550cb3c96c2de13ab1cdd5fa"}) etc...
// //       return res.json(prod);
// //     }
// //   });
// // });

// router.put("/:product_id/:collection_name", async (req, res, next) => {
//   const product = req.product;
//   const collectionName = req.params.collection_name;
//   const { body: newCollection } = req;

//   product[collectionName] = newCollection;
//   await product.save();

//   return res.json(newCollection);
// });

// // get product
// router.get("/:product_id", function (req, res, next) {
//   //var userid = JSON.parse(req.cookies.userid);
//   // ...
//   return res.json(req.product);
// });

// // delete product
// router.delete("/:product_id", async (req, res, next) => {
//   //   var userid = JSON.parse(req.cookies.userid);
//   /*
//   if (!(userid in req.product.permLookup) || req.product.permLookup[userid] < 3) {
//     var err = new Error("Unauthorized");
//     err.status = 401;
//     return next(err);
//   }
// */
//   var prodId = req.product._id;
//   // var prodUsers = Object.keys(req.product.permLookup);
//   await req.product.deleteOne();

//   // const users = await req.app.get("User").find({ _id: { $in: prodUsers } });
//   // for (var j = 0; j < users.length; j++) {
//   //   var user = removeUserProduct(users[j], prodId);
//   //   user.save(function (err) {
//   //     if (err) {
//   //       return next(err);
//   //     }
//   //   });
//   // }

//   return res.json({
//     success: true,
//   });
// });

// function removeUserProduct(user, prodId) {
//   var index = -1;
//   for (var i = 0; i < user.products.length; i++) {
//     if (prodId.equals(user.products[i])) {
//       index = i;
//     }
//   }
//   if (index >= 0) user.products.splice(index, 1);
//   if (user.currentProduct >= user.products.length) {
//     user.currentProduct = user.products.length - 1;
//   }
//   return user;
// }

import personasRoute from "./personas.js";
router.use("/:product_id/personas", personasRoute);

import storiesRoute from "./stories.js";
router.use("/:product_id/stories", storiesRoute);

import companiesRoute from "./companies.js";
router.use("/:product_id/companies", companiesRoute);

import tasksRoute from "./tasks.js";
router.use("/:product_id/tasks", tasksRoute);

//   return router;
// };

// module.exports = router;
export default router;
