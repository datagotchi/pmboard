var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  name: String,
  personas: [
    {
      name: String, 
      evidence: Array
    }
  ]
});

module.exports = productSchema;