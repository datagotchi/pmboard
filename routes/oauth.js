var express = require('express');
var router = express.Router();
var oauth = require('oauthio');
var mongoose = require('mongoose');

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
		// Here the user is authenticated, and the access token 
		// for the requested provider is stored in the session.
		// Continue the tutorial or checkout the step-4 to get
		// the code for the request
		//res.send(200, 'The user is authenticated');
		auth = request_object;
		return request_object.me();
	})
	.then(function(guser) {
  	// fetch the google user (by email) from mongo and return it to the client (with its products)
  	var db = mongoose.createConnection("mongodb://localhost/users");
    var userSchema = require('../schema/User');
    var User = db.model('User', userSchema);
  	User.findOne({'email': guser.email}, function(err, user) {
    	if (err) {
        next(err);
      }
      req.session.email = user.email;
      // TODO: write auth to database
      res.json({
        success: true,
        user: user
      });
  	});
	})
	.fail(function (e) {
		console.log(e);
		//res.send(400, 'Code is incorrect');
		res.sendStatus(500).send(e);
	});
});

module.exports = router;