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


// // database
// const models = require('./models').model;
// const ObjectId = require('mongodb').ObjectId;

// Passport and Express-Session library
const passport = require('passport');
const session = require('express-session');

const auth = require('./modules/auth.js');
const passportStrategies = require('./modules/passportStrategies.js');


//Import the secondary "Strategy" library
const LocalStrategy = require('passport-local').Strategy;

// Custom middleware authentication and flash message view middleware 
const userInViews = require('./modules/auth_middleware/UserInviews.js')
const flashMessageInViews = require('./modules/auth_middleware/flashMessageInviews.js')

// init framework
const app = express();

var flash = require('connect-flash');

app.use(flash());
// initialize session
app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
}));
// init passport on every route call.
app.use(passport.initialize());
// allow passport to use "express-session".
app.use(passport.session());


app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));    // parse application/x-www-form-urlencoded
app.use(express.json());    // parse application/json
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');


// log-in
passport.use('local-login', new LocalStrategy(passportStrategies.authUser))

// register
passport.use('local-signup', 
    new LocalStrategy(
        {passReqToCallback: true}, // we pass the re to the callback to be able to read the email (req.body.email)
        passportStrategies.registerUser)
);


passport.serializeUser( (userObj, done) => {
    done(null, userObj)
})

passport.deserializeUser((userObj, done) => {
    done (null, userObj )
})

// Custom middleware authentication and flash message view middleware
app.use(userInViews)
app.use(flashMessageInViews)


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