/*
function checkUserAccess(req, req_level) {
  var userid = JSON.parse(req.cookies.userid);
  if (!(userid in req.product.permLookup) || req.product.permLookup[userid] < req_level) {
    var err = new Error("Unauthorized");
    err.status = 403;
    return err;
  }
}
*/

const addItem = (collectionName) => async (req, res, next) => {
  /*
  var err = checkUserAccess(req, 2);
  if (err) return next(err);
*/

  var prod = req.product;
  var newObject = req.body;

  prod[collectionName].push(newObject);
  try {
    await prod.save();
    return res.json(prod[collectionName][prod[collectionName].length - 1]);
  } catch (err) {
    return next(err);
  }
};

const updateItem = (collectionName, indexName) => async (req, res, next) => {
  /*
  var err = checkUserAccess(req, 2);
  if (err) return next(err);
*/

  var prod = req.product;
  var ix = req[indexName];

  prod[collectionName][ix] = {
    ...prod[collectionName][ix],
    ...req.body,
  };

  prod.markModified(`${collectionName}.summary.steps`);

  try {
    await prod.save();
    return res.json({
      success: true,
    });
  } catch (err) {
    return next(err);
  }
};

const deleteItem = (collectionName, indexName) => async (req, res, next) => {
  /*
  var err = checkUserAccess(req, 2);
  if (err) return next(err);
*/

  var prod = req.product;
  var ix = req[indexName];
  prod[collectionName].splice(ix, 1);

  try {
    await prod.save();
    return res.json({
      success: true,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { addItem, updateItem, deleteItem };
