/* 
	users - name, challenges
- types
- interviews
- surveys
*/

var express = require('express');
var router = express.Router();

// ***** users ******

// get users
router.get('/products/:product_id/users', function(req, res, next) {
  res.send('');
});

// ***** user challenges ******

// get user challenges
router.get('/products/:product_id/users/:user_name/challenges', function(req, res, next) {
  res.send('');
});

// add user challenge
router.put('/products/:product_id/users/:user_name/challenges', function(req, res, next) {
  res.send('');
});

// change user challenge
router.post('/products/:product_id/users/:user_name/challenges/:challenge_text', function(req, res, next) {
  res.send('');
});

// ***** user types *****

// get user types
router.get('/products/:product_id/users/types', function(req, res, next) {
  res.send('');
});

// add user type
router.put('/products/:product_id/users/types', function(req, res, next) {
  res.send('');
});

// change user type
router.post('/products/:product_id/users/types/:type_name', function(req, res, next) {
  var type_name = req.params.type_name;
  res.send('');
});

// ****** user interviews *****

// get user interviews
router.get('/products/:product_id/users/interviews', function(req, res, next) {
  res.send('');
});

// add user interview
router.put('/products/:product_id/users/interviews', function(req, res, next) {
  res.send('');
});


module.exports = router;