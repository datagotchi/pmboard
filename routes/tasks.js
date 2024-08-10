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
  return res.json(req.product.tasks);
});

router.post("/", addItem("tasks"));

router.param("task_ix", function (req, res, next) {
  // TODO: assert ix is a normal int
  var ix = req.params.task_ix;
  var prod = req.product;
  if (ix && ix < prod.tasks.length) {
    req.task_ix = ix; // need to save just the index because we're saving the entire product document to the db
    return next();
  }
  var err = new Error("No such task");
  err.status = 404;
  return next(err);
});

router.put("/:task_ix", updateItem("tasks", "task_ix"));

router.delete("/:task_ix", deleteItem("tasks", "task_ix"));

// ****** persona evidence *****

// get persona evidence
router.get("/:task_ix/evidence", getEvidenceExpressFunc("taks", "task_ix"));

// add persona evidence
router.post("/:task_ix/evidence", addEvidenceExpressFunc("tasks", "task_ix"));

router.param("evidence_ix", trackEvidenceIndexExpressFunc("tasks", "task_ix"));

router.delete(
  "/:task_ix/evidence/:evidence_ix",
  deleteEvidenceExpressFunc("tasks", "task_ix")
);

router.get(
  "/:task_ix/evidence/:evidence_ix/trends",
  getTrendsExpressFunc("tasks", "task_ix")
);

router.post(
  "/:task_ix/evidence/:evidence_ix/trends",
  addTrendExpressFunc("tasks", "task_ix")
);

router.put(
  "/:task_ix/evidence/:evidence_ix/trends/:trend_ix",
  changeTrendExpressFunc("tasks", "task_ix")
);

router.delete(
  "/:task_ix/evidence/:evidence_ix/trends/:trend_ix",
  deleteTrendExpressFunc("tasks", "task_ix")
);

module.exports = router;
