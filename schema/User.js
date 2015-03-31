var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    "oauth_login": Object,
    "other_oauths": Array,
    "products": Array
    // TODO: add their current set of widgets/perspective (or make it per-product?)
  }
);

module.exports = userSchema;