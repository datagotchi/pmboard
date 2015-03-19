var express = require('express');
var router = express.Router();

var products = require('./routes/products');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Welcome to EcoBoard');
});

router.use('/products', products);

module.exports = router;
