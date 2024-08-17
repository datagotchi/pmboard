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
  updateEvidenceExpressFunc,
  deleteEvidenceExpressFunc,
  addTrendExpressFunc,
  changeTrendExpressFunc,
  deleteTrendExpressFunc,
} = require("./evidenceFunctions");

// get user personas
router.get("/", async (req, res, next) => {
  /*
  var err = checkUserAccess(req, 1);
  if (err) return next(err);
*/
  const personas = await req.client
    .query({
      text: "select * from personas where product_id = $1::integer",
      values: [req.product_id],
    })
    .then((result) => result.rows);
  await Promise.all(
    personas.map(async (persona) => {
      persona.evidence = await req.client
        .query({
          text: "select * from evidence where persona_id = $1::integer",
          values: [persona.id],
        })
        .then((result) => result.rows);
      await Promise.all(
        persona.evidence.map(async (file) => {
          file.trends = await req.client
            .query({
              text: "select * from trends where evidence_id = $1::integer",
              values: [file.id],
            })
            .then((result) => result.rows);
        })
      );
    })
  );
  return res.json(personas);
});

router.post("/", addItem("personas"));

router.param("persona_id", function (req, res, next) {
  // TODO: assert ix is a normal int
  var ix = req.params.persona_id;
  var prod = req.product;
  if (ix && ix < prod.personas.length) {
    req.persona_id = ix; // need to save just the index because we're saving the entire product document to the db
    return next();
  }
  var err = new Error("No such stakeholder type");
  err.status = 404;
  return next(err);
});

router.put("/:persona_id", updateItem("personas", "persona_id"));

router.delete("/:persona_id", deleteItem("personas", "persona_id"));

// ****** persona evidence *****

// get persona evidence
router.get(
  "/:persona_id/evidence",
  getEvidenceExpressFunc("personas", "persona_id")
);

// add persona evidence
router.post(
  "/:persona_id/evidence",
  addEvidenceExpressFunc("personas", "persona_id")
);

router.put("/:persona_id/evidence", updateEvidenceExpressFunc("persona_id"));

router.param(
  "evidence_ix",
  trackEvidenceIndexExpressFunc("personas", "persona_id")
);

router.delete(
  "/:company_ix/evidence/:evidence_ix",
  deleteEvidenceExpressFunc("personas", "persona_id")
);

router.get(
  "/:persona_id/evidence/:evidence_ix/trends",
  getTrendsExpressFunc("personas", "persona_id")
);

router.post(
  "/:persona_id/evidence/:evidence_ix/trends",
  addTrendExpressFunc("personas", "persona_id")
);

router.put(
  "/:persona_id/evidence/:evidence_ix/trends/:trend_ix",
  changeTrendExpressFunc("personas", "persona_id")
);

router.delete(
  "/:persona_id/evidence/:evidence_ix/trends/:trend_ix",
  deleteTrendExpressFunc("personas", "persona_id")
);

module.exports = router;
