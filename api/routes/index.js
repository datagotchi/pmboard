var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'EcoBoard' });
});

router.put('/usertypes', function(req, res, next) {
	res.send('Got a PUT request at /usertypes');
});

module.exports = router;
