var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/';

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("pndb");
  /*Return only the documents with the address "Park Lane 38":*/
  var query = { type: "pushy" };
  dbo.collection("pushassociations").find(query).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});


