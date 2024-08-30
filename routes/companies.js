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

router.get("/", async (req, res, next) => {
  /*
  const err = checkUserAccess(req, 1);
  if (err) return next(err);
*/
  const companies = await req.client
    .query({
      text: "select * from companies where product_id = $1::integer",
      values: [req.product_id],
    })
    .then((result) => result.rows);
  await Promise.all(
    companies.map(async (company) => {
      company.evidence = await req.client
        .query({
          text: "select * from evidence where company_id = $1::integer",
          values: [company.id],
        })
        .then((result) => result.rows);
      await Promise.all(
        company.evidence.map(async (file) => {
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
  return res.json(companies);
});

router.post("/", addItem("companies"));

router.param("company_id", function (req, res, next) {
  req.company_id = req.params.company_id;
  return next();
});

router.put("/:company_id", updateItem("companies", "company_id"));

router.delete("/:company_id", deleteItem("companies", "company_id"));

// evidence & trends from evidenceFunctions.js

router.get(
  "/:company_id/evidence",
  getEvidenceExpressFunc("companies", "company_id")
);

router.post("/:company_id/evidence", addEvidenceExpressFunc("company_id"));

router.param(
  "evidence_ix",
  trackEvidenceIdExpressFunc("companies", "company_id")
);

router.delete(
  "/:company_id/evidence/:evidence_ix",
  deleteEvidenceExpressFunc("companies", "company_id")
);

router.post(
  "/:company_id/evidence/:evidence_ix/trends",
  addTrendExpressFunc("companies", "company_id")
);

router.put(
  "/:company_id/evidence/:evidence_ix/trends/:trend_ix",
  updateTrendExpressFunc("companies", "company_id")
);

router.delete(
  "/:company_id/evidence/:evidence_ix/trends/:trend_ix",
  deleteTrendExpressFunc("companies", "company_id")
);

// module.exports = router;
export default router;
