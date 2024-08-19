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
const { formatSetClauseValue } = require("../util");

// get user personas
router.get("/", async (req, res, next) => {
  /*
  var err = checkUserAccess(req, 1);
  if (err) return next(err);
*/
  const tasks = await req.client
    .query({
      text: "select * from tasks where product_id = $1::integer",
      values: [req.product_id],
    })
    .then((result) => result.rows);
  // DEBUG until they get evidence
  tasks.forEach((task) => (task.evidence = []));
  req.client.release();
  // TODO: get and assign trends, too
  return res.json(tasks);
});

router.put("/", async (req, res, next) => {
  const tasks = req.body;
  await Promise.all(
    tasks.map((task) => {
      const setClause = Object.keys(task)
        .filter((key) => key !== "id")
        .map((key) => `${key} = ${formatSetClauseValue(task[key])}`)
        .join(", ");
      return req.client.query({
        text: `update tasks set ${setClause} where id = $1::integer`,
        values: [task.id],
      });
    })
  );
  req.client.release();
  return res.sendStatus(200);
});

router.post("/", addItem("tasks"));

router.param("task_id", function (req, res, next) {
  req.task_id = req.params.task_id;
  return next();
});

router.put("/:task_id", updateItem("tasks", "task_id"));

router.delete("/:task_id", deleteItem("tasks", "task_id"));

// ****** persona evidence *****

// get persona evidence
router.get("/:task_id/evidence", getEvidenceExpressFunc("taks", "task_id"));

// add persona evidence
router.post("/:task_id/evidence", addEvidenceExpressFunc("tasks", "task_id"));

router.param("evidence_ix", trackEvidenceIndexExpressFunc("tasks", "task_id"));

router.delete(
  "/:task_id/evidence/:evidence_ix",
  deleteEvidenceExpressFunc("tasks", "task_id")
);

router.get(
  "/:task_id/evidence/:evidence_ix/trends",
  getTrendsExpressFunc("tasks", "task_id")
);

router.post(
  "/:task_id/evidence/:evidence_ix/trends",
  addTrendExpressFunc("tasks", "task_id")
);

router.put(
  "/:task_id/evidence/:evidence_ix/trends/:trend_ix",
  changeTrendExpressFunc("tasks", "task_id")
);

router.delete(
  "/:task_id/evidence/:evidence_ix/trends/:trend_ix",
  deleteTrendExpressFunc("tasks", "task_id")
);

module.exports = router;
