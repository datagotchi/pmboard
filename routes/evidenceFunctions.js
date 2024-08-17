const getEvidenceExpressFunc =
  (itemCollectionName, itemIndexKey) => (req, res, next) => {
    const { product, [itemIndexKey]: ix } = req;

    return res.json(product[itemCollectionName][ix].evidence);
  };

const addEvidenceExpressFunc = (itemIdKey) => async (req, res, next) => {
  const { [itemIdKey]: id, body: record } = req;

  await req.client.query({
    text: `insert into evidence 
          (name, url, icon, ${itemIdKey}, created_date, modified_date) 
          values ($1::text, $2::text, $3::text, $4::integer, current_timestamp, current_timestamp)`,
    values: [record.name, record.url, record.icon, id],
  });

  req.client.release();
  return res.json({
    success: true,
  });
};

const updateEvidenceExpressFunc = (itemIdKey) => async (req, res, next) => {
  const { [itemIdKey]: itemId, body: records } = req;

  await Promise.all(
    records.map((record) => {
      if (record.id) {
        const setClauseItems = Object.keys(record).map(
          (recordKey) => `${recordKey} = ${JSON.stringify(record[recordKey])}`
        );
        setClauseItems.push(`${itemIdKey} = ${itemId}`);
        const setClause = setClauseItems.join(", ");
        return req.client.query({
          text: `update evidence set ${setClause} where id = $1::integer`,
          values: [record.id],
        });
      } else {
        return req.client.query({
          text: `insert into evidence 
              (name, url, icon, ${itemIdKey}, created_date, modified_date) 
              values ($1::text, $2::text, $3::text, $4::integer, current_timestamp, current_timestamp)`,
          values: [record.name, record.url, record.icon, itemId],
        });
      }
    })
  );
  req.client.release();
  return res.json({
    success: true,
  });
};

const trackEvidenceIndexExpressFunc =
  (itemCollectionName, itemIndexKey) => (req, res, next) => {
    const { evidence_ix } = req.params;
    const { product, [itemIndexKey]: itemIx } = req;
    if (
      evidence_ix &&
      evidence_ix < product[itemCollectionName][itemIx].evidence.length
    ) {
      req.evidence_ix = evidence_ix;
      return next();
    }
    var err = new Error("No such evidence file");
    err.status = 404;
    return next(err);
  };

const deleteEvidenceExpressFunc =
  (itemCollectionName, itemIndexKey) => async (req, res, next) => {
    const { product, [itemIndexKey]: itemIndex } = req;
    product[itemCollectionName][itemIndex].evidence.splice(req.evidence_ix, 1);

    await prod.save();
  };

// *** trends functions ***

const getTrendsExpressFunc =
  (itemCollectionName, itemIndexKey) => (req, res, next) => {
    const { product, [itemIndexKey]: itemIndex } = req;
    return res.json(
      product[itemCollectionName][itemIndex].evidence[req.evidence_ix].trends
    );
  };

const addTrendExpressFunc =
  (itemCollectionName, itemIndexKey) => async (req, res, next) => {
    const { product, [itemIndexKey]: itemIndex } = req;
    var trend = req.body;

    if (
      !(
        "trends" in
        product[itemCollectionName][itemIndex].evidence[req.evidence_ix]
      )
    ) {
      product[itemCollectionName][itemIndex].evidence[req.evidence_ix].trends =
        [];
    }
    product[itemCollectionName][itemIndex].evidence[
      req.evidence_ix
    ].trends.push(trend);

    await prod.save();
    return res.json(trend);
  };

const changeTrendExpressFunc =
  (itemCollectionName, itemIndexKey) => async (req, res, next) => {
    const { product, [itemIndexKey]: itemIndex } = req;
    var evIx = req.evidence_ix;
    var trendIx = req.params.trend_ix;
    var trend =
      product[itemCollectionName][itemIndex].evidence[evIx].trends[trendIx];

    // execute the PUT changes
    trend.type = req.body.type;

    await prod.save();
    return res.json({
      success: true,
    });
  };

const deleteTrendExpressFunc =
  (itemCollectionName, itemIndexKey) => async (req, res, next) => {
    const { product, [itemIndexKey]: itemIndex } = req;
    var evIx = req.evidence_ix;
    var trendIx = req.params.trend_ix;
    product[itemCollectionName][itemIndex].evidence[evIx].trends.splice(
      trendIx,
      1
    );

    await prod.save();

    return res.json({
      success: true,
    });
  };

module.exports = {
  getEvidenceExpressFunc,
  addEvidenceExpressFunc,
  trackEvidenceIndexExpressFunc,
  updateEvidenceExpressFunc,
  deleteEvidenceExpressFunc,
  getTrendsExpressFunc,
  addTrendExpressFunc,
  changeTrendExpressFunc,
  deleteTrendExpressFunc,
};
