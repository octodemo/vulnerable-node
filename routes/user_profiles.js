var express = require('express');
var check_logged = require("./login_check");
var db_user_profiles = require("../model/user_profiles");
var router = express.Router();

// Create a new user profile
router.post('/api/profiles', function(req, res, next) {
    check_logged(req, res);

    var profile = {
        username: req.body.username,
        email: req.body.email,
        full_name: req.body.full_name,
        bio: req.body.bio,
        avatar_url: req.body.avatar_url
    };

    // Validate required fields
    if (!profile.username || !profile.email) {
        return res.status(400).json({ error: 'Username and email are required' });
    }

    db_user_profiles.create(profile)
        .then(function (data) {
            res.status(201).json(data);
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to create profile' });
        });
});

// Get all user profiles
router.get('/api/profiles', function(req, res, next) {
    check_logged(req, res);

    db_user_profiles.list()
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to retrieve profiles' });
        });
});

// Get a specific user profile
router.get('/api/profiles/:username', function(req, res, next) {
    check_logged(req, res);

    var username = req.params.username;

    db_user_profiles.get(username)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            console.log(err);
            res.status(404).json({ error: 'Profile not found' });
        });
});

// Update a user profile
router.put('/api/profiles/:username', function(req, res, next) {
    check_logged(req, res);

    var username = req.params.username;
    var profile = {
        email: req.body.email,
        full_name: req.body.full_name,
        bio: req.body.bio,
        avatar_url: req.body.avatar_url
    };

    // Validate required fields
    if (!profile.email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    db_user_profiles.update(username, profile)
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            console.log(err);
            res.status(404).json({ error: 'Profile not found' });
        });
});

// Delete a user profile
router.delete('/api/profiles/:username', function(req, res, next) {
    check_logged(req, res);

    var username = req.params.username;

    db_user_profiles.delete(username)
        .then(function (data) {
            res.json({ message: 'Profile deleted successfully', data: data });
        })
        .catch(function (err) {
            console.log(err);
            res.status(404).json({ error: 'Profile not found' });
        });
});

module.exports = router;
