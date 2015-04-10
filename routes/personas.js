var express = require('express');
var router = express.Router();
//var mongoose = require('mongoose');
//var ObjectId = mongoose.Types.ObjectId;

// ***** user personas *****

// get user personas
router.get('/', function(req, res, next) {
  res.json(req.product.personas);
});

// add user persona
router.put('/', function(req, res, next) {
  
  var userid = req.app.get('userid');
  if (!(userid in req.product.permissions) || req.product.permissions[userid] < 2) {
    var err = new Error("Unauthorized");
    err.status = 401;
    next(err);
  }
  
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
router.post('/', function(req, res, next) {
  
  var userid = req.app.get('userid');
  if (!(userid in req.product.permissions) || req.product.permissions[userid] < 2) {
    var err = new Error("Unauthorized");
    err.status = 401;
    next(err);
  }
  
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
router.delete('/', function(req, res, next) {
  
  var userid = req.app.get('userid');
  if (!(userid in req.product.permissions) || req.product.permissions[userid] < 2) {
    var err = new Error("Unauthorized");
    err.status = 401;
    next(err);
  }
  
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
 
  var err = new Error('Invalid request; index not specified');
  err.status = 400;
  next(err);
});

// persona evidence
router.param('persona_ix', function(req, res, next) {
  // TODO: assert ix is a normal int
  var ix = req.params.persona_ix;
  var prod = req.product;
  if (ix && ix < prod.personas.length) {
    req.personaIx = ix; // need to save just the index because we're saving the entire product document to the db
    return next();
  }
  var err = new Error('No such user type');
  err.status = 404;
  next(err);
});

// ****** persona evidence *****

// get persona evidence
router.get('/:persona_ix/evidence', function(req, res, next) {
  var prod = req.product;
  var ix = req.personaIx;
  return res.json(prod.personas[ix].evidence);
});

// add persona evidence
router.put('/:persona_ix/evidence', function(req, res, next) {
  
  var userid = req.app.get('userid');
  if (!(userid in req.product.permissions) || req.product.permissions[userid] < 2) {
    var err = new Error("Unauthorized");
    err.status = 401;
    next(err);
  }
  
  var prod = req.product;
  var ix = req.personaIx;
  
  var ev = { 
    name: req.body.name,
    url: req.body.url,
    icon: req.body.icon
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

// delete persona evidence
router.delete('/:persona_ix/evidence', function(req, res, next) {
  
  var userid = req.app.get('userid');
  if (!(userid in req.product.permissions) || req.product.permissions[userid] < 2) {
    var err = new Error("Unauthorized");
    err.status = 401;
    next(err);
  }
  
  var prod = req.product;
  if (req.body.ix) {
    var ix = req.body.ix;
    prod.personas[req.personaIx].evidence.splice(ix, 1);
      
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
 
  var err = new Error('Invalid request; index not specified');
  err.status = 400;
  next(err);
});

// ***** persona trends ******

router.param('ev_ix', function(req, res, next) {
  // TODO: assert ev_ix is a normal int
  var ix = req.params.ev_ix;
  var prod = req.product;
  if (ix && ix < prod.personas[req.personaIx].evidence.length) {
    req.evIx = ix;
    return next();
  }
  var err = new Error('No such evidence file');
  err.status = 404;
  next(err);
});

// get persona trends
router.get('/:persona_ix/evidence/:ev_ix/trends', function(req, res, next) {
  var prod = req.product;
  var personaIx = req.personaIx;
  var evIx = req.evIx;
  return res.json(prod.personas[personaIx].evidence[evIx].trends);
});

// add persona trends
router.put('/:persona_ix/evidence/:ev_ix/trends', function(req, res, next) {
  
  var userid = req.app.get('userid');
  if (!(userid in req.product.permissions) || req.product.permissions[userid] < 2) {
    var err = new Error("Unauthorized");
    err.status = 401;
    next(err);
  }
  
  var prod = req.product;
  var personaIx = req.personaIx;
  var evIx = req.evIx;
  var trend = { 
    name: req.body.name
  };
  
  if (!('trends' in prod.personas[personaIx].evidence[evIx])) {
    prod.personas[personaIx].evidence[evIx].trends = [];
  }
  prod.personas[personaIx].evidence[evIx].trends.push(trend);
  
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

// delete persona trend
router.delete('/:persona_ix/evidence/:ev_ix/trends', function(req, res, next) {
  
  var userid = req.app.get('userid');
  if (!(userid in req.product.permissions) || req.product.permissions[userid] < 2) {
    var err = new Error("Unauthorized");
    err.status = 401;
    next(err);
  }
  
  var prod = req.product;
  var personaIx = req.personaIx;
  var evIx = req.evIx;
  if (req.body.ix) {
    var trendIx = req.body.ix;
    prod.personas[personaIx].evidence[evIx].trends.splice(trendIx, 1);
      
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
});

module.exports = router;