/**
 * Authentication Module
 * 
 * Handles user authentication against the PostgreSQL database.
 * 
 * CRITICAL VULNERABILITY: This module contains a deliberate SQL injection
 * vulnerability for security training purposes. The SQL query is constructed
 * using string concatenation without any input sanitization.
 * 
 * DO NOT use this code pattern in production applications!
 */

var config = require("../config"),
    pgp = require('pg-promise')();

/**
 * Authenticate a user with username and password
 * 
 * @param {string} username - The username to authenticate
 * @param {string} password - The password to verify
 * @returns {Promise} - Resolves with user data if credentials are valid
 * 
 * VULNERABILITY: SQL Injection (OWASP A1)
 * The function directly concatenates user input into SQL query without
 * any sanitization, parameterization, or validation.
 * 
 * Example attack: username = "admin' --" bypasses password check
 */
function do_auth(username, password) {
    // Create database connection
    var db = pgp(config.db.connectionString);

    // VULNERABLE: Direct string concatenation creates SQL injection vulnerability
    // Proper fix would use parameterized queries: db.one('SELECT * FROM users WHERE name = $1 AND password = $2', [username, password])
    var q = "SELECT * FROM users WHERE name = '" + username + "' AND password ='" + password + "';";

    // Execute query and return promise
    return db.one(q);
}

// Export authentication function
module.exports = do_auth;