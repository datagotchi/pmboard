var express = require('express');
var router = express.Router();

function checkUserAccess(req, req_level) {
  var userid = JSON.parse(req.cookies.userid);
  if (!(userid in req.product.permLookup) || req.product.permLookup[userid] < req_level) {
    var err = new Error("Unauthorized");
    err.status = 401;
    return err;
  }
}

// get user stories
router.get('/', function(req, res, next) {
  var err = checkUserAccess(req, 1);
  if (err) return next(err);
  return res.json(req.product.stories);
});

// add user story
router.post('/', function(req, res, next) {
  var err = checkUserAccess(req, 2);
  if (err) return next(err);
  
  var prod = req.product;
  var newstory = req.body.value;
  
  prod.stories.push({name: newstory});
  
  return prod.save(function(err) {
    if (err) { // TODO: convert to next(err)?
      return res.json({
        success: false,
        error: err
      });
    } else {
      return res.json({
        success: true
      });
    }
  });
});

// (id param)
router.param('story_ix', function(req, res, next) {
  // TODO: assert ix is a normal int
  var ix = req.params.story_ix;
  var prod = req.product;
  if (ix && ix < prod.stories.length) {
    req.storyIx = ix; // need to save just the index because we're saving the entire product document to the db
    return next();
  }
  var err = new Error('No such product benefit');
  err.status = 404;
  return next(err);
});

// change user story
router.put('/:story_ix', function(req, res, next) {
  
  var err = checkUserAccess(req, 2);
  if (err) return next(err);
  
  var prod = req.product;
  var ix = req.storyIx;
  
  prod.stories[ix].name = req.body.value;
    
  return prod.save(function(err) {
    if (err) { // TODO: convert to next(err)?
      return res.json({
        success: false,
        error: err
      });
    } else {
      return res.json({
        success: true
      });
    }
  });
});

// delete user story
router.delete('/:story_ix', function(req, res, next) {
  
  var err = checkUserAccess(req, 2);
  if (err) return next(err);
  
  var prod = req.product;
  var ix = req.storyIx;
  prod.stories.splice(ix, 1);
      
  return prod.save(function(err) {
    if (err || !prod) {
      return res.json({
        success: false,
        error: err
      });
    } else {
      return res.json({
        success: true
      });
    }
  });
 
  // TODO: remove this/put in the param thing above
  var err = new Error('Invalid request; index not specified');
  err.status = 400;
  return next(err);
});

// *** story evidence (personas -> trends) ***

// get story evidence 
router.get('/:story_ix/evidence', function(req, res, next) {
  var err = checkUserAccess(req, 1);
  if (err) return next(err);
  
  var prod = req.product;
  var ix = req.storyIx;
  return res.json(prod.stories[ix].evidence);
});

// add story evidence
router.post('/:story_ix/evidence', function(req, res, next) {
  var err = checkUserAccess(req, 2);
  if (err) return next(err);
  
  var prod = req.product;
  var ix = req.storyIx;
  
  var ev = { 
    name: req.body.name,
    path: req.body.path
  };
  
  if (!('evidence' in prod.personas[ix])) {
    prod.personas[ix].evidence = [];
  }
  prod.personas[ix].evidence.push(ev);
  
  return prod.save(function(err) {
    if (err) { // TODO: convert to next(err)?
      return res.json({
        success: false,
        error: err
      });
    } else {
      return res.json({
        success: true
      });
    }
  });
});

module.exports = router;