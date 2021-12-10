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
const {doc_find, doc_set_content, doc_set} = require("./modules/dbops");
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
        console.info(`SOCKETS User with ID ${userID} opened the document ${documentID} with permission ${permission}`);

        // Check if the document is already in memory
        if (!memoryDocs[documentID]) {
            // Load the document from the db

            memoryDocs[documentID] = {
                doc: schema.nodeFromJSON(doc.content),
                steps: [],
                stepClientIDs: [],
                selections: {}
            }
            console.info(`SOCKETS Document ${documentID} was loaded to memory`);
        }

        // Send document data to the client
        socket.emit("init", {
            document: memoryDocs[documentID].doc.toJSON(),
            version: memoryDocs[documentID].steps.length
        });
        // Join current document room
        socket.join(documentID);

        if (permission !== 'READ') {
            socket.on('update', async ({version, steps, clientID}) => {
                if (version !== memoryDocs[documentID].steps.length) return;

                // This updates the server version of the document.
                steps.forEach(stepJSON => {
                    let step = Step.fromJSON(schema, stepJSON);

                    memoryDocs[documentID].doc = (step.apply(memoryDocs[documentID].doc)).doc;
                    memoryDocs[documentID].steps.push(step);
                    memoryDocs[documentID].stepClientIDs.push(clientID);
                })

                // Save the document every 75 changes
                if (memoryDocs[documentID].steps.length % 75 === 0) {
                    try {
                        await doc_set_content(new ObjectId(documentID), memoryDocs[documentID].doc.toJSON(), false);
                        console.info(`SOCKETS Document ${documentID} was successfully saved`);
                        io.to(documentID).emit('save-success');
                    } catch (e) {
                        console.warn(`SOCKETS Document ${documentID} can't be saved: ` + e);
                        io.to(documentID).emit('save-fail', {error: e})
                    }
                }

                // Send changes
                io.to(documentID).emit('update', {
                    version: memoryDocs[documentID].steps.length,
                    steps: memoryDocs[documentID].steps,
                    stepClientIDs: memoryDocs[documentID].stepClientIDs
                });
            })

            socket.on('save', async () => {
                try {
                    await doc_set_content(new ObjectId(documentID), memoryDocs[documentID].doc.toJSON(), false);
                    console.info(`SOCKETS Document ${documentID} was successfully saved`);
                    io.to(documentID).emit('save-success');
                } catch (e) {
                    console.warn(`SOCKETS Document ${documentID} can't be saved: ` + e);
                    io.to(documentID).emit('save-fail', {error: e})
                }
            })

            socket.on('rename', async (newName) => {
                try {
                    if (typeof newName !== 'string') {
                        socket.emit('rename-fail', {error: 'Title should be a string'});
                        return;
                    }
                    if (newName.length > 100 || newName.length < 1) {
                        socket.emit('rename-fail', {error: 'Length of the title must be between 1 and 100'})
                        return;
                    }

                    await doc_set(new ObjectId(documentID), {title: newName}, false);
                    io.to(documentID).emit('rename-success', {newName});
                } catch (e) {
                    socket.emit('rename-fail', {error: 'Unknown error: ' + e});
                }
            })

            socket.on('selection-changed', ({from, to}) => {
                console.log(`Selection from ${from} to ${to}`);
            })
        }

        socket.on('disconnect', async () => {
            // Every room is a document in the memory
            // If there is a document in the memory, but no room with the same ID, that means
            // the document is not opened by anyone, memory can be freed.

            let docIDs = Object.keys(memoryDocs);
            for (let i = 0; i < docIDs.length; ++i) {
                if (!io.sockets.adapter.rooms.get(docIDs[i])) {
                    console.info(`SOCKETS Document with ID ${docIDs[i]} is not opened by anyone anymore, it will be removed from the memory`);
                    try {
                        await doc_set_content(new ObjectId(docIDs[i]), memoryDocs[docIDs[i]].doc.toJSON(), false);
                        console.info(`SOCKETS Document ${docIDs[i]} was successfully saved`);
                    } catch (e) {
                        console.warn(`SOCKETS Document ${docIDs[i]} can't be saved: ` + e);
                    }
                    delete memoryDocs[docIDs[i]];
                }
            }
        })
    } catch (e) {
        // Unauthorized connection
        socket.disconnect();
    }
})

server.on('listening', function () {
    console.log(`Express server listening on ${domain}:${server.address().port}`);
});


module.exports = server