var express = require('express');
var router = express.Router();
//var mongoose = require('mongoose');
//var ObjectId = mongoose.Types.ObjectId;

// ***** user personas *****

// get user personas
//router.get('/:product_id/personas', function(req, res, next) {
router.get('/', function(req, res, next) {
  res.json(req.product.personas);
});

// add user persona
//router.put('/:product_id/personas', function(req, res, next) {
router.put('/', function(req, res, next) {
  var prod = req.product;
  var newpersona = req.body.value;
  
  prod.personas.push({name: newpersona});
  
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

// change user persona
//router.post('/:product_id/personas', function(req, res, next) {
router.post('/', function(req, res, next) {
  var prod = req.product;
  var ix = req.body.pk;
  prod.personas.splice(ix, 1, {name: req.body.value});
    
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

// delete user persona
//router.delete('/:product_id/personas', function(req, res, next) {
router.delete('/', function(req, res, next) {
  var prod = req.product;
  if (req.body.ix) {
    var ix = req.body.ix;
    prod.personas.splice(ix, 1);
      
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
  }
 
  //res.status(400);
  var err = new Error('Invalid request; index not specified');
  err.status = 400;
  next(err);
});

// persona evidence
router.param('persona_name', function(req, res, next) {
  // TODO: assert name is a normal string
  var personaName = req.params.persona_name;
  var prod = req.product;
  for (var i in prod.personas) {
    if (prod.personas[i].name == personaName) {
      req.personaIx = i;
      next();
    }
  }
  //res.status(404);
  var err = new Error('No such user type');
  err.status = 404;
  next(err);
});

// ****** persona evidence *****

// get persona evidence
//router.get('/:product_id/personas/:persona_name/evidence', function(req, res, next) {
router.get('/:persona_name/evidence', function(req, res, next) {
  var prod = req.product;
  var ix = req.personaIx;
  res.json(prod.personas[ix].evidence);
});

// add persona evidence
//router.put('/:product_id/personas/:persona_name/evidence', function(req, res, next) {
router.put('/:persona_name/evidence', function(req, res, next) {
  var prod = req.product;
  var ix = req.personaIx;
  var evFile = req.body.fileName;
  if (!('evidence' in prod.personas[ix])) {
    prod.personas[ix].evidence = [];
  }
  prod.personas[ix].evidence.push(evFile);
  
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

// ***** persona trends ******
/*
// get persona trends
router.get('/:user_name/challenges', function(req, res, next) {
  res.send('');
});

// add persona trends
router.put('/:user_name/challenges', function(req, res, next) {
  res.send('');
});

// change persona trends
router.post('/:user_name/challenges/:challenge_name', function(req, res, next) {
  res.send('');
});
*/

module.exports = router;