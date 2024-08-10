const express = require("express");
const router = express.Router();

const {
  addItem,
  updateItem,
  deleteItem,
} = require("./collectionItemFunctions");

const {
  getEvidenceExpressFunc,
  addEvidenceExpressFunc,
  trackEvidenceIndexExpressFunc,
  deleteEvidenceExpressFunc,
  getTrendsExpressFunc,
  addTrendExpressFunc,
  changeTrendExpressFunc,
  deleteTrendExpressFunc,
} = require("./evidenceFunctions");

router.get("/", (req, res, next) => {
  /*
  const err = checkUserAccess(req, 1);
  if (err) return next(err);
*/
  return res.json(req.product.companies);
});

router.post("/", addItem("companies"));

router.param("company_ix", function (req, res, next) {
  const ix = req.params.company_ix;
  const prod = req.product;
  if (ix && ix < prod.companies.length) {
    req.company_ix = ix; // need to save just the index because we're saving the entire product document to the db
    return next();
  }
  const err = new Error("No such company type");
  err.status = 404;
  return next(err);
});

router.put("/:company_ix", updateItem("companies", "company_ix"));

router.delete("/:company_ix", deleteItem("companies", "company_ix"));

// evidence & trends from evidenceFunctions.js

router.get(
  "/:company_ix/evidence",
  getEvidenceExpressFunc("companies", "company_ix")
);

router.post(
  "/:company_ix/evidence",
  addEvidenceExpressFunc("companies", "company_ix")
);

router.param(
  "evidence_ix",
  trackEvidenceIndexExpressFunc("companies", "company_ix")
);

router.delete(
  "/:company_ix/evidence/:evidence_ix",
  deleteEvidenceExpressFunc("companies", "company_ix")
);

router.get(
  "/:company_ix/evidence/:evidence_ix/trends",
  getTrendsExpressFunc("companies", "company_ix")
);

router.post(
  "/:company_ix/evidence/:evidence_ix/trends",
  addTrendExpressFunc("companies", "company_ix")
);

router.put(
  "/:company_ix/evidence/:evidence_ix/trends/:trend_ix",
  changeTrendExpressFunc("companies", "company_ix")
);

router.delete(
  "/:company_ix/evidence/:evidence_ix/trends/:trend_ix",
  deleteTrendExpressFunc("companies", "company_ix")
);

module.exports = router;
