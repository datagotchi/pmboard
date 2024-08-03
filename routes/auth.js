const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
const hashCode = function (str) {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

let User;
router.use(function (req, res, next) {
  User = req.app.get("User");
  next();
});

router.get("/login", function (req, res, next) {
  const { email, hashedPassword } = req.query;
  User.findOne({ email })
    .populate("_id", "hashedPassword")
    .then((user) => {
      if (user) {
        if (user.hashPassword === hashedPassword) {
          req.session.cookie.userid = user._id; // TODO: verify this is a string
          const now = new Date().getTime();
          const token = hashCode(`${req.sessionID}${now}`);
          req.session.cookie.token = token;
          user.sessionToken = token;
          user
            .save()
            .then(() => {
              return res.sendStatus(200);
            })
            .catch((err) => {
              return next(err);
            });
        } else {
          const err = new Error("Invalid login attempt");
          err.status = 401;
          next(err);
        }
      } else {
        next(); // not found 404
      }
    })
    .catch(function (err) {
      return next(err);
    });
});

module.exports = router;
