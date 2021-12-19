/**
 * EJS Compiler
 *
 * Compile all views/*.ejs files into a single /public/js/views.js file
 * 
 * Simply require this module from the app.js to pre-compile all views when the server starts
 * 
 * app.js:
 * 
 * require("./ejs-compile");
 * 
 */

const fs = require('fs-extra');
const ejs = require('ejs');
const glob = require('glob-fs')({ gitignore: true });



function compile(view) {

    let v = view.replace(/\//g,"_").replace(/\.ejs$/,"");

    // console.log(v);

    let template = new String(fs.readFileSync(view));
    let f = ejs.compile(template, {client:true});

    let f_str = f.toString();

    f_str = f_str.replace("function anonymous(","ejs."+v+" = function(").replace("function(locals, escapeFn, include, rethrow", "function(locals, escapeFn, include = ejs.views_include(locals), rethrow")

    return f_str;

}

let compiled = glob.readdirSync("views/**/*.ejs").map(compile).join("\n\n");

let output = `//EJS Compiled Views - This file was automatically generated on ${new Date()}
ejs.views_include = function(locals) {
    console.log("views_include_setup",locals);
    return function(path, d) {
        console.log("ejs.views_include",path,d);
        return ejs["views_"+path.replace(/\\\//g,"_")]({...d,...locals}, null, ejs.views_include(locals));
    }
};
${compiled}`

fs.writeFile("public/js/views.js", output);

