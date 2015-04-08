var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
  name: String,
  personas: [
    {
      _id:false,
      name: String, 
      evidence: [
        {
          _id:false,
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