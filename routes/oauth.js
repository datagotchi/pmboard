var express = require('express');
var router = express.Router();
var oauth = require('oauthio');
var mongoose = require('mongoose');

/* Initialize and route oauth if necessary */
try {
  var config = require('../config');
  oauth.initialize(config.key, config.secret);
} catch (e) {
  console.log(e);
}

var User;
router.use(function(req, res, next) {
  User = req.app.get('User');
  next();
});

router.get('/token', function(req, res) {
	var token = oauth.generateStateToken(req.session);

	res.json({
		token: token
	});
});

router.post('/signin', function(req, res) {
	var code = req.body.code;
	var auth;
	
	oauth.auth('google', req.session, {
		code: code
	})
	.then(function (request_object) {
		auth = request_object;
		return request_object.me();
	})
	.then(function(guser) {
  	User.findOne({'email': guser.email})
  	  .populate('products', 'name')
  	  .exec(function(err, user) {
      	if (err) {
          return next(err);
        }
        if (user) {
            req.session.email = user.email;
            // TODO: write auth to database
            res.json({
                success: true,
                user: user,
                oauth: JSON.stringify(auth)
            });
        }

    	});
	})
	.fail(function (e) {
		console.log(e);
		res.sendStatus(500).send(e);
	});
});

module.exports = router;