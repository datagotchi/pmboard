var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Welcome to EcoBoard');
});

router.put('/usertypes', function(req, res, next) {
	res.status(400) // invalid request
		.send('Got a PUT request at /usertypes');
});

module.exports = router;
