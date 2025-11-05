/**
 * Main Application Entry Point
 * 
 * This is the core Express.js application that sets up a deliberately vulnerable
 * e-commerce website for security testing and training purposes.
 * 
 * WARNING: This application contains intentional security vulnerabilities and
 * should NEVER be deployed in a production environment.
 */

// Core Express and middleware dependencies
var express = require('express');
var session = require('express-session')  // Session management middleware
var engine = require('ejs-locals');       // EJS templating engine with layout support
var path = require('path');
var favicon = require('serve-favicon');
var fs = require("fs");
var logger = require('morgan');           // HTTP request logger
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // Parse incoming request bodies
var log4js = require("log4js");          // Application logging framework

// Application modules
var init_db = require('./model/init_db');  // Database initialization
var login = require('./routes/login');     // Authentication routes
var products = require('./routes/products'); // Product management routes

// Initialize Express application
var app = express();

// Configure application-specific logging
// Sets up file-based logging for the vulnerable node application
log4js.loadAppender('file');
//log4js.addAppender(log4js.appenders.console());  // Console logging disabled
log4js.addAppender(log4js.appenders.file('app-custom.log'), 'vnode');

// Create application logger instance
var logger4js = log4js.getLogger('vnode');
logger4js.setLevel('INFO');  // Log INFO level and above

// Create write stream for HTTP access logs
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'))

/*
 * Template Engine Configuration
 * Sets up EJS as the view engine with layout support
 */
app.engine('ejs', engine);

// Configure views directory location
app.set('views', path.join(__dirname, 'views'));
// Set EJS as the default template engine
app.set('view engine', 'ejs');

/*
 * Middleware Configuration
 * Sets up the middleware pipeline for request processing
 */

// HTTP request logging to file (combined format)
app.use(logger('combined', {stream: accessLogStream}));

// Body parsing middleware - parse request bodies in various formats
app.use(bodyParser());                                    // Generic body parser
app.use(bodyParser.json());                               // JSON payload parser
app.use(bodyParser.urlencoded({ extended: true }));      // URL-encoded form parser

// Cookie parsing middleware
app.use(cookieParser());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Session management configuration
// VULNERABILITY: Hardcoded session secret and insecure session settings
app.use(session({
  secret: 'ñasddfilhpaf78h78032h780g780fg780asg780dsbovncubuyvqy',  // VULNERABLE: Hardcoded secret
  cookie: {
    secure: false,      // VULNERABLE: Cookies not restricted to HTTPS
    maxAge: 99999999999 // VULNERABLE: Extremely long session lifetime
  }
}));

/*
 * Routes Configuration
 * Mounts the route handlers for different application modules
 */
app.use('', products);  // Product listing, search, and purchase routes
app.use('', login);     // Authentication and session management routes


/*
 * 404 Handler
 * Catches all requests that don't match any routes
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);  // Forward to error handler
});

/*
 * Error Handlers
 * Handles errors differently based on environment
 */

// Development error handler - includes stack traces
// VULNERABILITY: Exposes detailed error information in development mode
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err  // VULNERABLE: Full error object exposed (includes stack trace)
    });
  });
}

// Production error handler
// Sanitizes error details to avoid information leakage
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}  // No stack traces leaked to user
  });
});

/*
 * Database Initialization
 * Creates and populates the PostgreSQL database with initial data
 */
logger4js.info("Building database")

// Initialize database tables and populate with dummy data
init_db();

// Export the configured Express application
module.exports = app;
