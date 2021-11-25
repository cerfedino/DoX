const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

/**
 * Fetches the database and the collections.
*/

///// PARAMETERS
const mongodb_uri = "mongodb://localhost:27017"
const db_name     = "DoX_db"; // TODO: Remove placeholder
const collections = ["users","docs"];
////////////////////


const model = {}
MongoClient
    .connect(mongodb_uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(client => {
        model.db = client.db(db_name);
        collections.forEach(k => {
            model[k] = model.db.collection(k)
        })
        console.log("[+] Fetched MongoDB database and collections")
        // require('./sync').check(model.music, "public/music").then(console.log);
    })

exports.model = model