var config = require("../config"),
    pgp = require('pg-promise')(),
    db = pgp(config.db.connectionString);

function list_products() {
    
    var q = "SELECT * FROM products;";

    return db.many(q);
}

function getProduct(product_id) {

    var q = "SELECT * FROM products WHERE id = $1;";

    return db.one(q, [product_id]);
}

function search(query) {

    var q = "SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $2;";

    return db.many(q, ['%' + query + '%', '%' + query + '%']);

}

function purchase(cart) {

    var q = "INSERT INTO purchases(mail, product_name, user_name, product_id, address, phone, ship_date, price) VALUES($1, $2, $3, $4, $5, $6, $7, $8);";

    return db.one(q, [cart.mail, cart.product_name, cart.username, cart.product_id, cart.address, cart.ship_date, cart.phone, cart.price]);

}

function get_purcharsed(username) {

    var q = "SELECT * FROM purchases WHERE user_name = $1;";

    return db.many(q, [username]);

}

var actions = {
    "list": list_products,
    "getProduct": getProduct,
    "search": search,
    "purchase": purchase,
    "getPurchased": get_purcharsed
}

module.exports = actions;
