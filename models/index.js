/**
 * Web Atelier 2021  Final Project
 *
 * MongoDB Database
 * 
 * The database contains 2 collections:
 * 
 *       USERS
 *       { 
 *           {ObjectId} _id, 
 *           {string}   username, 
 *           {string}   password_hash, 
 *           {string}   email 
 *       } 
 * 
 *
 *       DOCS
 *       { 
 *           {ObjectId} _id, 
 *           {URL} path, 
 *           perms: { 
 *                   read: [], 
 *                   edit: [] 
 *           }, 
 *           {ObjectId} owner, 
 *       
 *           {URL} read_link, 
 *           {URL} edit-link, 
 *       
 *           {Date} edit_date, 
 *           {Date} created_date 
 *       } 
 *
 */


const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const MongoClient = mongodb.MongoClient;

const mongodb_uri = 'mongodb://localhost:27017';
const db_name = 'SA3-Final-Project';

const users_collection_name = 'users';
const docs_collection_name = 'docs';

const model = {};

MongoClient
    .connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log("Connected to " + mongodb_uri);
        model.db = client.db(db_name);
        model.users = model.db.collection(users_collection_name);
        model.docs = model.db.collection(docs_collection_name);
        
    })
    .catch(err => console.error(err));

exports.model = model;