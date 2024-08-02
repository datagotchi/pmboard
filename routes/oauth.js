const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
let oauth;

const importOAuth = async () => {
  oauth = await import("oauth4webapi");
};

var User;
router.use(async (req, res, next) => {
  User = req.app.get("User");
  await importOAuth();
  next();
});

router.get("/token", function (req, res, next) {
  console.log("*** in GET /token");
  console.log("*** req.session: ", req.session);
  var token = oauth.generateStateToken(req.session);
  console.log("*** token: ", token);

  res.json({
    token: token,
  });
});

router.post("/signin", function (req, res, next) {
  var code = req.body.code;
  var auth;

  oauth
    .auth("google", req.session, {
      code: code,
    })
    .then(function (request_object) {
      auth = request_object;
      return request_object.me();
    })
    .then(function (guser) {
      User.findOne({ email: guser.email })
        .populate("products", "name")
        .then(function (user) {
          if (user) {
            req.session.email = user.email;
            // TODO: write auth to database
            var ret = {
              success: true,
              user: user,
              oauth: JSON.stringify(auth),
            };
            return res.json(ret);
          }
        })
        .catch(function (err) {
          if (err) {
            return next(err);
          }
        });
    })
    .fail(function (e) {
      return next(e);
    });
});

module.exports = router;
