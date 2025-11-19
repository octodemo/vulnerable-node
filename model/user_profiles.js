var config = require("../config"),
    pgp = require('pg-promise')(),
    db = pgp(config.db.connectionString);

function createProfile(profile) {
    var q = "INSERT INTO user_profiles(username, email, full_name, bio, avatar_url) VALUES($1, $2, $3, $4, $5) RETURNING *;";
    return db.one(q, [profile.username, profile.email, profile.full_name, profile.bio, profile.avatar_url]);
}

function getProfile(username) {
    var q = "SELECT * FROM user_profiles WHERE username = $1;";
    return db.one(q, [username]);
}

function updateProfile(username, profile) {
    var q = "UPDATE user_profiles SET email = $2, full_name = $3, bio = $4, avatar_url = $5 WHERE username = $1 RETURNING *;";
    return db.one(q, [username, profile.email, profile.full_name, profile.bio, profile.avatar_url]);
}

function deleteProfile(username) {
    var q = "DELETE FROM user_profiles WHERE username = $1 RETURNING *;";
    return db.one(q, [username]);
}

function listProfiles() {
    var q = "SELECT * FROM user_profiles;";
    return db.many(q);
}

var actions = {
    "create": createProfile,
    "get": getProfile,
    "update": updateProfile,
    "delete": deleteProfile,
    "list": listProfiles
};

module.exports = actions;
