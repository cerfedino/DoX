/**
 * Web Atelier 2021  - Final Project
 *
 * Clear Mongodb database
 *
 */
const {model} = require('../models');
const { exit } = require("process");


/**
 * Empties out every database's collection.
 */
async function clear_db() {
    await model.users.deleteMany({})
    console.log('[+] All users have been deleted!');
    await model.docs.deleteMany({})
    console.log('[+] All docs have been deleted!');
    exit()
    
    // fs.emptyDir(dir, err =>{
    //     if (err) return console.error(err);
    //     console.log('All files have been deleted!')
    // });
}

setTimeout(clear_db,1000)