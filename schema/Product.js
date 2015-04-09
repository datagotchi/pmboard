var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: String,
  permissions: [
    {type: Schema.ObjectId, ref: 'User'}
  ],
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