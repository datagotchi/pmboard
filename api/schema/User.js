var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    "oauth": {
      "oauth_token": String,
      "oauth_token_secret": String,
      "provider": String
    },
    "products": Array
    // TODO: add their current set of widgets/perspective (or make it per-product?)
  }
);

module.exports = userSchema;