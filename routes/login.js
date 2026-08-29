var log4js = require("log4js");
var url = require("url");
var express = require('express');
var auth = require("../model/auth");
var router = express.Router();

var logger = log4js.getLogger('vnode')

// Login template
router.get('/login', function(req, res, next) {

    var url_params = url.parse(req.url, true).query;

    res.render('login', {returnurl: url_params.returnurl, auth_error: url_params.error});
});


// Do auth
router.post('/login/auth', function(req, res) {

    var user = req.body.username;
    var password = req.body.password;
    var returnurl = req.body.returnurl;

    // Sanitize user input before logging
    var sanitizedUser = user.replace(/[^a-zA-Z0-9]/g, '');
    logger.error("Tried to login attempt from user = " + sanitizedUser);

    auth(user, password)
        .then(function (data) {
            req.session.logged = true;
            req.session.user_name = user;

            // Validate the return URL
            if (!returnurl || !returnurl.startsWith('/')) {
                returnurl = "/";
            }

            res.redirect(returnurl);
        })
        .catch(function (err) {
            res.redirect("/login?returnurl=" + returnurl + "&error=" + err.message);
        });

});

// Do logout
router.get('/logout', function(req, res, next) {

    req.session.logged = false;
    req.session.user = null;

    res.redirect("/login")
});

module.exports = router;
