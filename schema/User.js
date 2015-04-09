var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    "email": String,
    "oauths": Array,
    "products": [
      {type: Schema.ObjectId, ref: 'Product'}
    ],
    "currentProduct": Number
    // TODO: add their current set of widgets/perspective (or make it per-product)?
  }
);

module.exports = userSchema;