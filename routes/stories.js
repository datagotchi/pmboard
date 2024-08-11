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
  updateEvidenceExpressFunc,
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
  return res.json(req.product.stories);
});

router.post("/", addItem("stories"));

router.param("story_ix", function (req, res, next) {
  // TODO: assert ix is a normal int
  const ix = req.params.story_ix;
  const prod = req.product;
  if (ix && ix < prod.stories.length) {
    req.story_ix = ix; // need to save just the index because we're saving the entire product document to the db
    return next();
  }
  const err = new Error("No such user story");
  err.status = 404;
  return next(err);
});

router.put("/:story_ix", updateItem("stories", "story+ix"));

router.delete("/:story_ix", deleteItem("stories", "story_ix"));

// evidence & trends from evidenceFunctions.js

router.get(
  "/:story_ix/evidence",
  getEvidenceExpressFunc("stories", "story_ix")
);

router.post(
  "/:story_ix/evidence",
  addEvidenceExpressFunc("stories", "story_ix")
);

router.put(
  "/:story_ix/evidence",
  updateEvidenceExpressFunc("stories", "story_ix")
);

router.param(
  "evidence_ix",
  trackEvidenceIndexExpressFunc("stories", "story_ix")
);

router.delete(
  "/:story_ix/evidence/:evidence_ix",
  deleteEvidenceExpressFunc("stories", "story_ix")
);

router.get(
  "/:story_ix/evidence/:evidence_ix/trends",
  getTrendsExpressFunc("stories", "story_ix")
);

router.post(
  "/:story_ix/evidence/:evidence_ix/trends",
  addTrendExpressFunc("stories", "story_ix")
);

router.put(
  "/:story_ix/evidence/:evidence_ix/trends/:trend_ix",
  changeTrendExpressFunc("stories", "story_ix")
);

router.delete(
  "/:story_ix/evidence/:evidence_ix/trends/:trend_ix",
  deleteTrendExpressFunc("stories", "story_ix")
);

module.exports = router;
