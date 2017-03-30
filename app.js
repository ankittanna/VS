/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var mongoose   = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');


// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

/*mongoose.connect('mongodb://vinod:password@ds061325.mongolab.com:61325/dmc', function(err) {*/
/*mongoose.connect('mongodb://localhost:27017/virtualstoredb', function(err) {
    if (err) throw err;
});*/

var connection = mongoose.connect('mongodb://localhost:27017/virtualstoredb');

autoIncrement.initialize(connection);

var Model = require('./client/model');


var Order = mongoose.model('Order'),
    Vendor = mongoose.model('Vendor'),
    Employee = mongoose.model('Employee');
    
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

//var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
//router.use(function(req, res, next) {
    // do logging
  //  console.log('Something is happening.');
  ////  next(); // make sure we go to the next routes and don't stop here
//});

var routes = require('./client/routs')(app); //This is the extra line

// start server on the specified port and binding host
app.listen(3001, '127.0.0.1', function() {
	// print a message when the server starts listening
  console.log("server started");
});




