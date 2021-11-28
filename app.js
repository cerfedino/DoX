/**
 * Web Atelier 2021  Final Project : DoX
 *
 * Main Server Aplication
 * 
 */


// require framework and middleware dependencies
const express = require('express');
const path = require('path');
const logger = require('morgan');
const methodOverride = require('method-override');


// database
const models = require('./models').model;
const ObjectId = require('mongodb').ObjectId;

// init framework
const app = express();

app.use(logger('dev'));

app.use(express.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
app.use(express.json());    // parse application/json
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');


// controllers
//this will automatically load all routers found in the routes folder
const routers = require('./routes');


app.use('/', routers.root);


//default fallback handlers
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});
//}




// Start server
app.set('port', process.env.PORT || 8888);

var server = require('http').createServer(app);


server.on('listening', function() {
	console.log('Express server listening on port ' + server.address().port);
});

server.listen(app.get('port'));