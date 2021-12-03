const {model} = require('../models');
const { exit } = require("process");
const dbops = require('../modules/dbops.js')

/**
 * Populates the database with mock data.
 */
async function populate_db() {

    await dbops.user_create("Username1","mail1", "hash1")
    await dbops.user_create("Username2","mail2", "hash2")
    await dbops.user_create("Username3","mail3", "hash3")
    await dbops.user_create("Username4","mail4", "hash4")
    await dbops.user_create("Username5","mail5", "hash5")
    await dbops.user_create("Username6","mail6", "hash6")
    await dbops.user_create("Username7","mail7", "hash7")


    await dbops.doc_create((await (dbops.user_find({username:"Username1"})))._id)
    await dbops.doc_create((await (dbops.user_find({username:"Username1"})))._id)
    await dbops.doc_create((await (dbops.user_find({username:"Username2"})))._id)
    await dbops.doc_create((await (dbops.user_find({username:"Username3"})))._id)
    await dbops.doc_create((await (dbops.user_find({username:"Username4"})))._id)
    await dbops.doc_create((await (dbops.user_find({username:"Username5"})))._id)
    await dbops.doc_create((await (dbops.user_find({username:"Username5"})))._id)
    
    // fs.emptyDir(dir, err =>{
    //     if (err) return console.error(err);
    //     console.log('All files have been deleted!')
    // });
    exit();
}

setTimeout(populate_db,1000)