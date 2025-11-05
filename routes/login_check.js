/**
 * Session Validation Middleware
 * 
 * Checks if a user is authenticated before allowing access to protected routes.
 * Redirects unauthenticated users to the login page with a return URL.
 * 
 * VULNERABILITY: Unvalidated redirect (OWASP A10)
 * The returnurl parameter is not validated, allowing open redirect attacks
 */

/**
 * Check if user is logged in
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * 
 * Verifies that req.session.logged is true. If not authenticated,
 * redirects to login page with the current URL as a return parameter.
 * 
 * VULNERABILITY: Open Redirect (OWASP A10)
 * The returnurl parameter is constructed from req.url without validation,
 * potentially allowing attackers to redirect users to malicious sites
 */
function check_logged(req, res) {

    // Check if user is authenticated via session
    if (req.session.logged == undefined || req.session.logged == false)
    {
        // VULNERABLE: Unvalidated redirect using user-controlled req.url
        res.redirect("/login?returnurl=" + req.url);
    }
}

// Export middleware function
module.exports = check_logged;