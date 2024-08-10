var express = require("express");
var router = express.Router();

const {
  addItem,
  updateItem,
  deleteItem,
} = require("./collectionItemFunctions");

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

// get user personas
router.get("/", (req, res, next) => {
  /*
  var err = checkUserAccess(req, 1);
  if (err) return next(err);
*/
  return res.json(req.product.personas);
});

router.post("/", addItem("personas"));

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

router.put("/:persona_ix", updateItem("personas", "persona_ix"));

router.delete("/:persona_ix", deleteItem("personas", "persona_ix"));

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
