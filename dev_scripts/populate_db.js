const {model} = require('../models');
const { exit } = require("process");
const dbops = require('../modules/dbops.js')

/**
 * Populates the database with mock data.
 */
async function populate_db() {

    await dbops.create_user("Username1","mail1", "hash1")
    await dbops.create_user("Username2","mail2", "hash2")
    await dbops.create_user("Username3","mail3", "hash3")
    await dbops.create_user("Username4","mail4", "hash4")
    await dbops.create_user("Username5","mail5", "hash5")
    await dbops.create_user("Username6","mail6", "hash6")
    await dbops.create_user("Username7","mail7", "hash7")


    await dbops.create_doc((await (dbops.find_user({username:"Username1"})))._id)
    await dbops.create_doc((await (dbops.find_user({username:"Username1"})))._id)
    await dbops.create_doc((await (dbops.find_user({username:"Username2"})))._id)
    await dbops.create_doc((await (dbops.find_user({username:"Username3"})))._id)
    await dbops.create_doc((await (dbops.find_user({username:"Username4"})))._id)
    await dbops.create_doc((await (dbops.find_user({username:"Username5"})))._id)
    await dbops.create_doc((await (dbops.find_user({username:"Username5"})))._id)
    
    // fs.emptyDir(dir, err =>{
    //     if (err) return console.error(err);
    //     console.log('All files have been deleted!')
    // });
    exit();
}

setTimeout(populate_db,1000)