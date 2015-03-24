var mongoose = require('mongoose');

var widgetSchema = new mongoose.Schema({
  //name: String,
  title: String,
  unitName: String // e.g., "feature", "user type",
  columns: Array,
  mongoObject: String // name of the data source to lookup to populate the grid
});

module.exports = widgetSchema;