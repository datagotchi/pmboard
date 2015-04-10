var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: String,
  permissions: [{
    _id: {type: Schema.ObjectId, ref: 'User'},
    permission: Number // 0: no access, 1: read access, 2: write access, ... high number: owner/admin
  }],
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