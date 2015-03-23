var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  name: String,
  personas: Array
});

module.exports = productSchema;