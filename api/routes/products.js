var users = require('./routes/users');

// get products
router.get('/products', function(req, res, next) {
  res.send('');
});

// add product

// change product details

router.param('product_id', function(req, res, next, product_id) {
  // typically we might sanity check that user_id is of the right format
  UserDatabase.find(product_id, function(err, product) {
    if (err) return next(err);
    if (!product) return next(...create a 404 error...);
 
    req.product = product;
    next()
  });
});

router.post('/products/:product_id', function(req, res, next) {
  res.send('');
});

router.use('/products/:product_id/users', users);