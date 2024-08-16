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

router.get("/", async (req, res, next) => {
  /*
  const err = checkUserAccess(req, 1);
  if (err) return next(err);
*/
  const stories = await req.client
    .query({
      text: "select * from stories where product_id = $1::integer",
      values: [req.product_id],
    })
    .then((result) => result.rows);
  await Promise.all(
    stories.map(async (story) => {
      story.evidence = await req.client
        .query({
          text: "select * from evidence where story_id = $1::integer",
          values: [story.id],
        })
        .then((result) => result.rows);
      await Promise.all(
        story.evidence.map(async (personaAsEvidence) => {
          personaAsEvidence.trends = await req.client
            .query({
              text: "select * from trends where evidence_id = $1::integer",
              values: [personaAsEvidence.id],
            })
            .then((result) => result.rows);
        })
      );
    })
  );
  return res.json(stories);
});

router.post("/", addItem("stories"));

router.param("story_id", function (req, res, next) {
  req.story_id = req.params.story_id;
  const prod = req.product;
  next();
});

router.put("/:story_id", async (req, res, next) => {
  // await updateItem("stories", "story_id")(req, res, next);
  if (req.body.summary) {
    const story_id = req.story_id;
    const { summary } = req.body;
    let journeyId = summary.id;
    let steps = summary.steps;
    if (!summary.id) {
      journeyId = await req.client
        .query({
          text: "insert into journeys (story_id) values ($1::integer) returning *",
          values: [story_id],
        })
        .then((result) => result.rows[0].id);
    }
    await Promise.all(
      steps.map((step) => {
        req.client.query({
          text: `insert into journey_steps (journey_id, tag_id, tag_class_name, x, y) 
          values ($1::integer, $2::text, $3::text, $4::text, $5::text) 
          on conflict (journey_id, tag_id) do update 
            set tag_class_name = $3::text, x = $4::text, y = $5::text`,
          values: [journeyId, step.tagId, step.tagClassName, step.x, step.y],
        });
      })
    );

    return res.sendStatus(200);
  }
  return res.sendStatus(400);
});

router.delete("/:story_id", deleteItem("stories", "story_id"));

// evidence & trends from evidenceFunctions.js

router.get(
  "/:story_id/evidence",
  getEvidenceExpressFunc("stories", "story_id")
);

router.post(
  "/:story_id/evidence",
  addEvidenceExpressFunc("stories", "story_id")
);

router.put(
  "/:story_id/evidence",
  updateEvidenceExpressFunc("stories", "story_id")
);

router.param(
  "evidence_ix",
  trackEvidenceIndexExpressFunc("stories", "story_id")
);

router.delete(
  "/:story_id/evidence/:evidence_ix",
  deleteEvidenceExpressFunc("stories", "story_id")
);

router.get(
  "/:story_id/evidence/:evidence_ix/trends",
  getTrendsExpressFunc("stories", "story_id")
);

router.post(
  "/:story_id/evidence/:evidence_ix/trends",
  addTrendExpressFunc("stories", "story_id")
);

router.put(
  "/:story_id/evidence/:evidence_ix/trends/:trend_ix",
  changeTrendExpressFunc("stories", "story_id")
);

router.delete(
  "/:story_id/evidence/:evidence_ix/trends/:trend_ix",
  deleteTrendExpressFunc("stories", "story_id")
);

module.exports = router;
