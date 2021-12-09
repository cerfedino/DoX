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
const {Server} = require("socket.io");
const {doc_find} = require("./modules/dbops");
const {ObjectId} = require("mongodb");
const schema = require('./modules/schema');

// Application config import
const {webserver} = require('./config/config.js')

var setDomain = require('express-set-domain');

// Passport and Express-Session library
const passport = require('passport');
const session = require('express-session');
// Passport strategies for authentication
const passportStrategies = require('./modules/auth_strategies.js');


//Import the secondary "Strategy" library
const LocalStrategy = require('passport-local').Strategy;

// Custom middleware authentication and flash message view middleware 
const flash = require('connect-flash');
const serve_auth_info_toViews = require('./modules/auth_middleware/auth_info_views_middleware.js')


/////////////////////////////////////////////////////////////////////////////////////
// INIT framework
const app = express();


// add middleware to force requests to domain
const domain = webserver.domain
// app.use(setDomain(domain));

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));    // parse application/x-www-form-urlencoded
app.use(express.json());    // parse application/json
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

const sessionMiddleware = session({
    name: 'dox.auth',
    secret: "secret",
    resave: false,
    saveUninitialized: true,
});

// INIT session
app.use(sessionMiddleware);

// INIT passport on every route call.
app.use(passport.initialize());
// allow passport to use "express-session".
app.use(passport.session());

// log-in
passport.use('local-login', new LocalStrategy(passportStrategies.authUser))

// register
passport.use('local-signup',
    new LocalStrategy(
        {passReqToCallback: true}, // we pass the re to the callback to be able to read the email (req.body.email)
        passportStrategies.registerUser)
);

// attach the {authenticate_user} to req.session.passport.user.{authenticated_user}
passport.serializeUser((userObj, done) => {
    done(null, userObj)
})
// get the {authenticated_user} for the session from "req.session.passport.user.{authenticated_user}, and attach it to req.user.{authenticated_user}
passport.deserializeUser((userObj, done) => {
    done(null, userObj)
})

// flash messages
app.use(flash());
// Custom middleware authentication and flash message view middleware
app.use(serve_auth_info_toViews);


/////////////////////////////////////////////////////////////////////////////////////
// CONTROLLERS
//this will automatically load all routers found in the routes folder
const routers = require('./routes');
const {Step} = require("prosemirror-transform");

app.use('/auth', routers.router_auth);
app.use('/', routers.root);

// Static folders
app.use('/', express.static('public'));

//default fallback handlers
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
});


/////////////////////////////////////////////////////////////////////////////////////
// Start server
app.set('port', webserver.port)

const server = require('http').createServer(app);
const io = new Server(server);
let memoryDocs = {}

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
})

io.on('connection', async (socket) => {
    try {
        let userID = socket.request.session.passport.user.user_id;
        let documentID = socket.handshake.query.documentID;
        let permission = ''; // should be 'OWNER', 'WRITE' or 'READ';

        // Undefined shouldn't be handled, as any exception will disconnect the socket
        // Permissions check
        const doc = await doc_find({_id: new ObjectId(documentID)});
        if (doc.owner.toString() === userID)
            permission = 'OWNER';
        else if (doc.perm_edit.includes(userID))
            permission = 'WRITE';
        else if (doc.perm_read.includes(userID)) {
            permission = 'READ';
        } else {
            socket.disconnect();
            return;
        }

        // Check if the document is already in memory
        if (!memoryDocs[documentID]) {
            // Load the document from the db
            memoryDocs[documentID] = {
                doc: schema.nodeFromJSON((JSON.parse(doc.content)).doc),
                steps: [],
                stepClientIDs: []
            }
        }

        // Send document data to the client
        socket.emit("init", {
            document: memoryDocs[documentID].doc.toJSON(),
            version: memoryDocs[documentID].steps.length
        });
        // Join current document room
        socket.join(documentID);

        if (permission !== 'READ') {
            socket.on('update', ({version, steps, clientID}) => {
                if (version !== memoryDocs[documentID].steps.length) return;

                // This updates the server version of the document.
                steps.forEach(stepJSON => {
                    let step = Step.fromJSON(schema, stepJSON);

                    memoryDocs[documentID].doc = (step.apply(memoryDocs[documentID].doc)).doc;
                    memoryDocs[documentID].steps.push(step);
                    memoryDocs[documentID].stepClientIDs.push(clientID);
                })

                // Send changes
                //socket.to(documentID).emit
                io.to(documentID).emit('update', {
                    version: memoryDocs[documentID].steps.length,
                    steps: memoryDocs[documentID].steps,
                    stepClientIDs: memoryDocs[documentID].stepClientIDs
                });
            })
        }
    } catch (e) {
        // Unauthorized connection
        socket.disconnect();
    }
})

server.on('listening', function () {
    console.log(`Express server listening on ${domain}:${server.address().port}`);
});


module.exports = server