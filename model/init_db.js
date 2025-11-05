/**
 * Database Initialization Module
 * 
 * Creates database schema and populates initial data for the vulnerable
 * e-commerce application. Uses a "create if not exists" pattern by attempting
 * to create tables and handling errors if they already exist.
 * 
 * Tables created:
 * - users: User accounts with credentials
 * - products: Product catalog
 * - purchases: Purchase history
 */

var config = require("../config");
var dummy = require("../dummy");      // Test data
var pgp = require('pg-promise')();

/**
 * Initialize Database
 * 
 * Creates database tables and populates them with dummy data if they don't exist.
 * Uses error handling as a "table exists" check - if CREATE fails (table exists),
 * it attempts to insert dummy data instead.
 * 
 * Note: This pattern is suitable for development but not recommended for production.
 */
function init_db() {

    // Create database connection
    var db = pgp(config.db.connectionString);

    /*
     * Users Table
     * Stores user authentication credentials
     */
    db.one('CREATE TABLE users(name VARCHAR(100) PRIMARY KEY, password VARCHAR(50));')
        .then(function () {
            // Table created successfully (first run)
        })
        .catch(function (err) {
            // Table already exists - populate with dummy data

            // Insert dummy users from test data
            var users = dummy.users;
            for (var i = 0; i < users.length; i ++) {
                var u = users[i];
                // Use parameterized query (safe from SQL injection)
                db.one('INSERT INTO users(name, password) values($1, $2)', [u.username, u.password])
                    .then(function () {
                        // User inserted successfully
                    })
                    .catch(function (err) {
                        // User may already exist - silently ignore
                    });
            }

        });

    /*
     * Products Table
     * Stores product catalog information
     */
    db.one('CREATE TABLE products(id INTEGER PRIMARY KEY, name VARCHAR(100) not null, description TEXT not null, price INTEGER, image VARCHAR(500))')
        .then(function () {
            // Table created successfully (first run)
        })
        .catch(function (err) {
            // Table already exists - populate with dummy data

            // Insert dummy products from test data
            var products = dummy.products;
            for (var i = 0; i < products.length; i ++) {
                var p = products[i];
                // Use parameterized query (safe from SQL injection)
                db.one('INSERT INTO products(id, name, description, price, image) values($1, $2, $3, $4, $5)', [i, p.name, p.description, p.price, p.image])
                    .then(function () {
                        // Product inserted successfully
                    })
                    .catch(function (err) {
                        // Product may already exist - silently ignore
                    });
            }

        });

    /*
     * Purchases Table
     * Stores customer purchase history
     */
    db.one('CREATE TABLE purchases(id SERIAL PRIMARY KEY, product_id INTEGER not null, product_name VARCHAR(100) not null, user_name VARCHAR(100), mail VARCHAR(100) not null, address VARCHAR(100) not null, phone VARCHAR(40) not null, ship_date VARCHAR(100) not null, price INTEGER not null)')
        .then(function () {
            // Table created successfully (first run)
        })
        .catch(function (err) {
            // Table already exists - no initial data needed
        });


}

// Export initialization function
module.exports = init_db;