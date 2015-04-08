var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    "email": String,
    "oauths": Array,
    "products": [{
      name: String,
      id: String
    }],
    "currentProduct": Number
    // TODO: add their current set of widgets/perspective (or make it per-product)?
  }
);

module.exports = userSchema;