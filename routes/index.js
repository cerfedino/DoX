/**
 * Web Atelier 2021  Final Project : DoX
 *
 * Router auto-loader
 *
 */

const fs = require('fs');

const dirEntries = fs.readdirSync(__dirname);
const base = __dirname + '/';
const routers = {};
 
try {
    dirEntries.forEach(function(dirEntry) {
        const stats = fs.statSync(base + dirEntry);
        //try to load router of dir
        try {
            if (stats.isDirectory()) {

                const router = require(base + dirEntry + '/router');
                //add router to our list of routers;
                routers[dirEntry] = router;

            } else {
                const router = require(base + dirEntry);
                //add router to our list of routers;
                routers[dirEntry.replace(/.js$/,"")] = router;
            }
        } catch (err) {
            console.log('Could not get router for ' + dirEntry);
            console.log(err.toString() + err.stack);
        }
    });
} catch (err) {
    console.log('Error while loading routers');
    console.log(err.stack);
    //We don't know what happened, export empty object
    routers = {}
} finally {
    module.exports = routers;
}