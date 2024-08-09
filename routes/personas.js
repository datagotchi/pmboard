var express = require("express");
const {
  getEvidenceExpressFunc,
  addEvidenceExpressFunc,
  getTrendsExpressFunc,
  trackEvidenceIndexExpressFunc,
  deleteEvidenceExpressFunc,
  addTrendExpressFunc,
  changeTrendExpressFunc,
  deleteTrendExpressFunc,
} = require("./evidenceFunctions");
var router = express.Router();
//var mongoose = require('mongoose');
//var ObjectId = mongoose.Types.ObjectId;

/*
function checkUserAccess(req, req_level) {
  var userid = JSON.parse(req.cookies.userid);
  if (!(userid in req.product.permLookup) || req.product.permLookup[userid] < req_level) {
    var err = new Error("Unauthorized");
    err.status = 403;
    return err;
  }
}
*/

// get user personas
router.get("/", (req, res, next) => {
  /*
  var err = checkUserAccess(req, 1);
  if (err) return next(err);
*/
  return res.json(req.product.personas);
});

// add user persona
router.post("/", async (req, res, next) => {
  /*
  var err = checkUserAccess(req, 2);
  if (err) return next(err);
*/

  var prod = req.product;
  var newpersona = req.body;

  prod.personas.push(newpersona);
  await prod.save();

  return res.json(prod.personas[prod.personas.length - 1]);
});

router.param("persona_ix", function (req, res, next) {
  // TODO: assert ix is a normal int
  var ix = req.params.persona_ix;
  var prod = req.product;
  if (ix && ix < prod.personas.length) {
    req.persona_ix = ix; // need to save just the index because we're saving the entire product document to the db
    return next();
  }
  var err = new Error("No such stakeholder type");
  err.status = 404;
  return next(err);
});

router.put("/:persona_ix", async (req, res, next) => {
  /*
  var err = checkUserAccess(req, 2);
  if (err) return next(err);
*/

  var prod = req.product;
  var ix = req.persona_ix;

  prod.personas[ix] = {
    ...prod.personas[ix],
    ...req.body,
  };

  await prod.save();
  return res.json({
    success: true,
  });
});

// delete user persona
router.delete("/:persona_ix", async (req, res, next) => {
  /*
  var err = checkUserAccess(req, 2);
  if (err) return next(err);
*/

  var prod = req.product;
  var ix = req.persona_ix;
  prod.personas.splice(ix, 1);

  try {
    await prod.save();
    return res.json({
      success: true,
    });
  } catch (err) {
    return next(err);
  }
});

// ****** persona evidence *****

// get persona evidence
router.get(
  "/:persona_ix/evidence",
  getEvidenceExpressFunc("personas", "persona_ix")
);

// add persona evidence
router.post(
  "/:persona_ix/evidence",
  addEvidenceExpressFunc("personas", "persona_ix")
);

router.param(
  "evidence_ix",
  trackEvidenceIndexExpressFunc("personas", "persona_ix")
);

router.delete(
  "/:company_ix/evidence/:evidence_ix",
  deleteEvidenceExpressFunc("personas", "persona_ix")
);

router.get(
  "/:persona_ix/evidence/:evidence_ix/trends",
  getTrendsExpressFunc("personas", "persona_ix")
);

router.post(
  "/:persona_ix/evidence/:evidence_ix/trends",
  addTrendExpressFunc("personas", "persona_ix")
);

router.put(
  "/:persona_ix/evidence/:evidence_ix/trends/:trend_ix",
  changeTrendExpressFunc("personas", "persona_ix")
);

router.delete(
  "/:persona_ix/evidence/:evidence_ix/trends/:trend_ix",
  deleteTrendExpressFunc("personas", "persona_ix")
);

module.exports = router;
