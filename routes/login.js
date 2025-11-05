/**
 * Authentication Routes
 * 
 * Handles user login, logout, and authentication workflows.
 * 
 * VULNERABILITIES:
 * - SQL Injection via auth module (OWASP A1)
 * - Open Redirect via unvalidated returnurl (OWASP A10)
 * - Information leakage via error messages (OWASP A6)
 * - Log injection via unsanitized username (OWASP A1)
 */

var log4js = require("log4js");
var url = require("url");
var express = require('express');
var auth = require("../model/auth");  // Authentication module (contains SQL injection)
var router = express.Router();

// Get application logger
var logger = log4js.getLogger('vnode')

/**
 * GET /login
 * Display login form
 * 
 * Query parameters:
 * - returnurl: URL to redirect to after successful login
 * - error: Authentication error message to display
 * 
 * VULNERABILITY: XSS (OWASP A3)
 * Error parameter is rendered without sanitization
 */
router.get('/login', function(req, res, next) {

    // Parse query string parameters
    var url_params = url.parse(req.url, true).query;

    // Render login template with return URL and any error messages
    // VULNERABLE: auth_error rendered without escaping
    res.render('login', {returnurl: url_params.returnurl, auth_error: url_params.error});
});


/**
 * POST /login/auth
 * Process login credentials
 * 
 * Form body parameters:
 * - username: User's login name
 * - password: User's password
 * - returnurl: URL to redirect to after login
 * 
 * VULNERABILITIES:
 * - SQL Injection via auth() call (OWASP A1)
 * - Log Injection via unsanitized username (OWASP A1)
 * - Open Redirect via returnurl (OWASP A10)
 * - Sensitive data exposure via error messages (OWASP A6)
 */
router.post('/login/auth', function(req, res) {

    // Extract credentials and return URL from request body
    var user = req.body.username;
    var password = req.body.password;
    var returnurl = req.body.returnurl;

    // VULNERABILITY: Log Injection
    // Username is logged without sanitization - could inject malicious log entries
    logger.error("Tried to login attempt from user = " + user);

    // Attempt authentication (VULNERABLE: SQL injection in auth module)
    auth(user, password)
        .then(function (data) {
            // Authentication successful - create session
            req.session.logged = true;
            req.session.user_name = user;

            // Default to home page if no return URL specified
            if (returnurl == undefined || returnurl == ""){
                returnurl = "/";
            }

            // VULNERABILITY: Open Redirect (OWASP A10)
            // returnurl is not validated - could redirect to external malicious site
            res.redirect(returnurl);
        })
        .catch(function (err) {
            // Authentication failed
            // VULNERABILITY: Information Leakage (OWASP A6)
            // Database error messages exposed to user via URL parameter
            res.redirect("/login?returnurl=" + returnurl + "&error=" + err.message);
        });

});

/**
 * GET /logout
 * Log out current user and destroy session
 * 
 * Clears session data and redirects to login page
 */
router.get('/logout', function(req, res, next) {

    // Clear session authentication state
    req.session.logged = false;
    req.session.user = null;

    // Redirect to login page
    res.redirect("/login")
});

// Export router
module.exports = router;
