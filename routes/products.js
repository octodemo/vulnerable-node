/**
 * Product Management Routes
 * 
 * Handles product listing, searching, viewing details, and purchasing.
 * All routes require authentication via check_logged middleware.
 * 
 * VULNERABILITIES:
 * - SQL Injection in multiple endpoints (OWASP A1)
 * - Insecure Direct Object Reference (OWASP A4)
 * - Price manipulation via client-side data (OWASP A4)
 * - ReDoS via email regex validation (OWASP A5)
 * - CSRF on purchase endpoint (OWASP A8)
 */

var express = require('express');
var check_logged = require("./login_check");  // Session validation middleware
var url = require("url");
var db_products = require("../model/products");  // Product database operations (contains SQL injection)
var router = express.Router();


/**
 * GET /
 * Display home page with product catalog
 * 
 * Shows all available products to authenticated users.
 */
router.get('/', function(req, res, next) {

    // Verify user is authenticated
    check_logged(req, res);

    // Fetch all products from database
    db_products.list()
        .then(function (data) {
            // Render product catalog
            res.render('products', { products: data });
        })
        .catch(function (err) {
            // Handle database errors
            console.log(err);

            // Render empty product list on error
            res.render('products', { products: [] });
        });
});

/**
 * GET /products/purchased
 * Display user's purchase history
 * 
 * Shows all products purchased by the currently logged-in user.
 * 
 * VULNERABILITY: SQL Injection via username (OWASP A1)
 * Session username is passed to database query without validation
 */
router.get('/products/purchased', function(req, res, next) {

    // Verify user is authenticated
    check_logged(req, res);

    // Fetch purchases for current user (VULNERABLE: SQL injection in getPurchased)
    db_products.getPurchased(req.session.user_name)
        .then(function (data) {

            console.log(data);
            // Render purchase history
            res.render('bought_products', { products: data });
        })
        .catch(function (err) {
            console.log(err);

            // Render empty list on error
            res.render('bought_products', { products: [] });
        });
});

/**
 * GET /products/detail
 * Display detailed information for a specific product
 * 
 * Query parameters:
 * - id: Product ID to display
 * 
 * VULNERABILITIES:
 * - SQL Injection via id parameter (OWASP A1)
 * - Insecure Direct Object Reference (OWASP A4)
 */
router.get('/products/detail', function(req, res, next) {

    // Verify user is authenticated
    check_logged(req, res);

    // Parse query parameters
    var url_params = url.parse(req.url, true).query;

    // Get product ID from query string (no validation)
    var product_id = url_params.id;

    // Fetch product details (VULNERABLE: SQL injection in getProduct)
    db_products.getProduct(product_id)
        .then(function (data) {
            // Render product detail page
            res.render('product_detail', { product: data });
        })
        .catch(function (err) {
            console.log(err);

            // Render empty product list on error
            res.render('products', { products: [] });
        });
});



/**
 * GET /products/search
 * Search for products by name or description
 * 
 * Query parameters:
 * - q: Search query string
 * 
 * VULNERABILITY: SQL Injection via search query (OWASP A1)
 * Search term is passed directly to database without sanitization
 */
router.get('/products/search', function(req, res, next) {

    // Verify user is authenticated
    check_logged(req, res);

    // Parse query parameters
    var url_params = url.parse(req.url, true).query;
    var query = url_params.q;

    // Handle empty search - display search form
    if (query == undefined) {
        res.render('search', { in_query: "", products: [] });
        return;
    }

    // Perform search (VULNERABLE: SQL injection in search function)
    db_products.search(query)
        .then(function (data) {

            // Render search results
            res.render('search', { in_query: query, products: data });
        })
        .catch(function (err) {

            console.log(err);

            // Render empty results on error
            res.render('search', { in_query: query, products: [] });
        });

});


/**
 * ALL /products/buy
 * Process product purchase
 * 
 * Accepts both GET and POST requests.
 * 
 * Parameters (query string or form body):
 * - mail: Customer email address
 * - address: Shipping address
 * - ship_date: Requested shipping date
 * - phone: Contact phone number
 * - product_id: ID of product to purchase
 * - product_name: Name of product
 * - price: Price with currency symbol (e.g., "29€")
 * 
 * VULNERABILITIES:
 * - CSRF - No CSRF token validation (OWASP A8)
 * - Price Manipulation - Client provides price value (OWASP A4)
 * - SQL Injection via purchase data (OWASP A1)
 * - ReDoS - Email regex vulnerable to catastrophic backtracking (OWASP A5)
 * - Missing Error Handling - Returns success even on database errors
 */
router.all('/products/buy', function(req, res, next) {

    // Verify user is authenticated
    check_logged(req, res);

    // VULNERABILITY: CSRF (OWASP A8)
    // Accepts GET requests without CSRF protection
    // Both GET and POST accepted without token validation
    var params = null;
    if (req.method == "GET"){
        params = url.parse(req.url, true).query;
    } else {
        params = req.body;
    }

    var cart = null;

    try {

        // Basic parameter validation
        if (params.price == undefined){
            throw new Error("Missing parameter 'price'");
        }

        // Build cart object
        // VULNERABILITY: Price Manipulation (OWASP A4)
        // Price comes from client-side - user can modify it to any value
        cart = {
            mail: params.mail,
            address: params.address,
            ship_date: params.ship_date,
            phone: params.phone,
            product_id: params.product_id,
            product_name: params.product_name,
            username: req.session.user_name,
            price: params.price.substr(0, params.price.length - 1) // remove "€" symbol
        }

        // VULNERABILITY: ReDoS (Regular Expression Denial of Service) (OWASP A5)
        // This regex is vulnerable to catastrophic backtracking with inputs like:
        // "aaaaaaaaaaaaaaaaaaaaaaaa@"
        // The nested quantifiers cause exponential time complexity
        var re = /^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$/
        if (!re.test(cart.mail)){
            throw new Error("Invalid mail format");
        }

        // Validate all required fields are present
        for (var prop in cart){
            if (cart[prop] == undefined){
                throw new Error("Missing parameter '" + prop + "'");
            }
        }

    }
    catch (err){
        // Return validation errors as JSON
        return res.status(400).json({message: err.message});
    }

    // Save purchase to database
    // VULNERABLE: SQL injection in purchase function
    db_products.purchase(cart)
        .catch(function (err) {
            // VULNERABILITY: Error Handling (OWASP A6)
            // Returns success message even when database operation fails
            console.log(err);

            return res.json({message: "Product purchased correctly"});
        });

});



// Export router
module.exports = router;
