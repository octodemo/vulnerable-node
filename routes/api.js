var express = require('express');
var router = express.Router();
var db_products = require("../model/products");
var auth = require("../model/auth");

/**
 * API Routes - RESTful endpoints that return JSON
 */

// GET /api/products - List all products
router.get('/api/products', function(req, res) {
    db_products.list()
        .then(function (data) {
            res.json({ success: true, products: data });
        })
        .catch(function (err) {
            res.status(500).json({ success: false, error: err.message });
        });
});

// GET /api/products/search?q=query - Search products (must be before :id route)
router.get('/api/products/search', function(req, res) {
    var query = req.query.q;

    if (!query) {
        return res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
    }

    db_products.search(query)
        .then(function (data) {
            res.json({ success: true, products: data, query: query });
        })
        .catch(function (err) {
            res.status(500).json({ success: false, error: err.message });
        });
});

// GET /api/products/:id - Get a specific product by ID
router.get('/api/products/:id', function(req, res) {
    var product_id = req.params.id;

    db_products.getProduct(product_id)
        .then(function (data) {
            res.json({ success: true, product: data });
        })
        .catch(function (err) {
            res.status(404).json({ success: false, error: 'Product not found' });
        });
});

// POST /api/purchases - Create a new purchase
router.post('/api/purchases', function(req, res) {
    var cart = {
        mail: req.body.mail,
        address: req.body.address,
        ship_date: req.body.ship_date,
        phone: req.body.phone,
        product_id: req.body.product_id,
        product_name: req.body.product_name,
        username: req.body.username,
        price: req.body.price
    };

    // Validate required fields
    for (var prop in cart) {
        if (cart[prop] == undefined) {
            return res.status(400).json({ success: false, error: "Missing parameter '" + prop + "'" });
        }
    }

    // Validate email format
    var re = /^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$/;
    if (!re.test(cart.mail)) {
        return res.status(400).json({ success: false, error: 'Invalid mail format' });
    }

    db_products.purchase(cart)
        .then(function (data) {
            res.status(201).json({ success: true, message: 'Product purchased successfully' });
        })
        .catch(function (err) {
            res.status(500).json({ success: false, error: err.message });
        });
});

// GET /api/purchases?username=user - Get purchases for a specific user
router.get('/api/purchases', function(req, res) {
    var username = req.query.username;

    if (!username) {
        return res.status(400).json({ success: false, error: 'Query parameter "username" is required' });
    }

    db_products.getPurchased(username)
        .then(function (data) {
            res.json({ success: true, purchases: data });
        })
        .catch(function (err) {
            res.status(500).json({ success: false, error: err.message });
        });
});

// POST /api/auth - Authenticate a user
router.post('/api/auth', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    auth(username, password)
        .then(function (data) {
            res.json({ success: true, message: 'Authentication successful', user: { name: data.name } });
        })
        .catch(function (err) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        });
});

module.exports = router;
