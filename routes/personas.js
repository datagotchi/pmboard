import express from "express";
const router = express.Router();

import { addItem, updateItem, deleteItem } from "./collectionItemFunctions.js";

import {
  getEvidenceExpressFunc,
  addEvidenceExpressFunc,
  trackEvidenceIdExpressFunc,
  deleteEvidenceExpressFunc,
  addTrendExpressFunc,
  updateTrendExpressFunc,
  deleteTrendExpressFunc,
} from "./evidenceFunctions.js";
import { formatSQLValue } from "../util.js";

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
  req.client.release();
  return res.json(personas);
});

router.put("/", async (req, res, next) => {
  const personas = req.body;
  await Promise.all(
    personas.map((persona) => {
      const setClause = Object.keys(persona)
        .filter((key) => key !== "id")
        .map((key) => `${key} = ${formatSQLValue(persona[key])}`);
      return req.client.query({
        text: `update personas set ${setClause} where id = $1::integer`,
        values: [persona.id],
      });
    })
  );
  req.client.release();
  return res.sendStatus(200);
});

router.post("/", addItem("personas"));

router.param("persona_id", function (req, res, next) {
  req.persona_id = req.params.persona_id;
  return next();
});

router.put("/:persona_id", updateItem("personas", "persona_id"));

router.delete("/:persona_id", deleteItem("personas", "persona_id"));

// ****** persona evidence *****

router.get(
  "/:persona_id/evidence",
  getEvidenceExpressFunc("personas", "persona_id")
);

router.post("/:persona_id/evidence", addEvidenceExpressFunc("persona_id"));

router.param("evidence_id", trackEvidenceIdExpressFunc());

router.delete(
  "/:company_ix/evidence/:evidence_id",
  deleteEvidenceExpressFunc()
);

// router.get(
//   "/:persona_id/evidence/:evidence_id/trends",
//   getTrendsExpressFunc("personas", "persona_id")
// );

router.post("/:persona_id/evidence/:evidence_id/trends", addTrendExpressFunc());

router.put(
  "/:persona_id/evidence/:evidence_id/trends/:trend_id",
  updateTrendExpressFunc()
);

router.delete(
  "/:persona_id/evidence/:evidence_id/trends/:trend_id",
  deleteTrendExpressFunc()
);

export default router;
