var client = require('mongodb').MongoClient;
client.connect("mongodb://localhost/pmboard", function(err, db) {
  if (err) return console.error(err);

  var collection = db.collection('products');
  
  collection.find().toArray(function (err, products) {
    if (err) return console.error(err);
    
    products.forEach(function(prod, index) {
      if (!prod['stories']) {
        prod['stories'] = [];
        collection.update({_id: prod._id}, prod, function(err) {
          if (err) console.error(err);
        });
      }
    });
    
    db.close();
  });
});