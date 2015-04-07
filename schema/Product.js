var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  name: String,
  personas: [
    {
      name: String, 
      evidence: [
        {
          name: String,
          url: String,
          icon: String,
          trends: Array
        }
      ]
    }
  ]
});

module.exports = productSchema;