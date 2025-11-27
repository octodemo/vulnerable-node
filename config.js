var fs = require('fs');

// Function to read Docker secrets
function readSecret(secretPath, defaultValue) {
    try {
        if (secretPath && fs.existsSync(secretPath)) {
            return fs.readFileSync(secretPath, 'utf8').trim();
        }
    } catch (err) {
        console.warn('Warning: Could not read secret from ' + secretPath);
    }
    return defaultValue;
}

// Read database credentials from Docker secrets or environment variables
var dbUser = readSecret(process.env.DB_USER_FILE, 'postgres');
var dbPassword = readSecret(process.env.DB_PASSWORD_FILE, 'postgres');

var config_local = {
    // Customer module configs
    "db": {
        "server": "postgres://" + dbUser + ":" + dbPassword + "@127.0.0.1",
        "database": "vulnerablenode"
    }
}

var config_devel = {
    // Customer module configs
    "db": {
        "server": "postgres://" + dbUser + ":" + dbPassword + "@10.211.55.70",
        "database": "vulnerablenode"
    }
}

var config_docker = {
    // Customer module configs
    "db": {
        "server": "postgres://" + dbUser + ":" + dbPassword + "@postgres_db",
        "database": "vulnerablenode"
    }
}

// Select correct config
var config = null;

switch (process.env.STAGE){
    case "DOCKER":
        config = config_docker;
        break;

    case "LOCAL":
        config = config_local;
        break;

    case "DEVEL":
        config = config_devel;
        break;

    default:
        config = config_devel;
}

// Build connection string
config.db.connectionString = config.db.server + "/" + config.db.database

module.exports = config;