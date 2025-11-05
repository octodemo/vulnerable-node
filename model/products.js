/**
 * Product Data Access Module
 * 
 * Provides database operations for product management including listing,
 * searching, viewing details, and purchasing products.
 * 
 * CRITICAL VULNERABILITIES: Multiple SQL injection vulnerabilities exist
 * throughout this module due to unsafe query construction.
 * 
 * DO NOT use these patterns in production applications!
 */

var config = require("../config"),
    pgp = require('pg-promise')(),
    db = pgp(config.db.connectionString);  // Create persistent database connection

/**
 * List all products in the catalog
 * 
 * @returns {Promise<Array>} - Array of all product records
 * 
 * SAFE: This query has no user input and is not vulnerable
 */
function list_products() {
    
    var q = "SELECT * FROM products;";

    return db.many(q);
}

/**
 * Get details for a specific product by ID
 * 
 * @param {string} product_id - The product ID to retrieve
 * @returns {Promise<Object>} - Product record
 * 
 * VULNERABILITY: SQL Injection (OWASP A1)
 * Product ID is directly concatenated into query without validation
 * Example attack: product_id = "1' OR '1'='1"
 */
function getProduct(product_id) {

    // VULNERABLE: Direct string concatenation
    var q = "SELECT * FROM products WHERE id = '" + product_id + "';";

    return db.one(q);
}

/**
 * Search products by name or description
 * 
 * @param {string} query - Search term to match against product name/description
 * @returns {Promise<Array>} - Array of matching products
 * 
 * VULNERABILITY: SQL Injection (OWASP A1)
 * Search query is directly concatenated without sanitization
 * Example attack: query = "'; DROP TABLE products; --"
 */
function search(query) {

    // VULNERABLE: User input directly embedded in ILIKE clauses
    var q = "SELECT * FROM products WHERE name ILIKE '%" + query + "%' OR description ILIKE '%" + query + "%';";

    return db.many(q);

}

/**
 * Record a product purchase
 * 
 * @param {Object} cart - Cart object containing purchase details
 * @param {string} cart.mail - Customer email
 * @param {string} cart.product_name - Name of purchased product
 * @param {string} cart.username - Username of purchaser
 * @param {string} cart.product_id - ID of purchased product
 * @param {string} cart.address - Shipping address
 * @param {string} cart.phone - Contact phone number
 * @param {string} cart.ship_date - Requested shipping date
 * @param {number} cart.price - Purchase price
 * @returns {Promise<Object>} - Inserted purchase record
 * 
 * VULNERABILITY: SQL Injection (OWASP A1)
 * All cart fields are directly concatenated into INSERT statement
 * Multiple injection points make this extremely vulnerable
 */
function purchase(cart) {

    // VULNERABLE: Multiple user inputs concatenated without any escaping
    var q = "INSERT INTO purchases(mail, product_name, user_name, product_id, address, phone, ship_date, price) VALUES('" +
            cart.mail + "', '" +
            cart.product_name + "', '" +
            cart.username + "', '" +
            cart.product_id + "', '" +
            cart.address + "', '" +
            cart.ship_date + "', '" +
            cart.phone + "', '" +
            cart.price +
            "');";

    return db.one(q);

}

/**
 * Get all purchases for a specific user
 * 
 * @param {string} username - Username to retrieve purchases for
 * @returns {Promise<Array>} - Array of purchase records
 * 
 * VULNERABILITY: SQL Injection (OWASP A1)
 * Username directly concatenated into WHERE clause
 * Example attack: username = "' OR '1'='1" returns all purchases
 */
function get_purcharsed(username) {

    // VULNERABLE: Direct string concatenation
    var q = "SELECT * FROM purchases WHERE user_name = '" + username + "';";

    return db.many(q);

}

// Export object containing all product operations
var actions = {
    "list": list_products,
    "getProduct": getProduct,
    "search": search,
    "purchase": purchase,
    "getPurchased": get_purcharsed
}

module.exports = actions;
