/**
 * Configuration Management
 * 
 * Manages environment-specific configurations for the application.
 * Supports LOCAL, DEVEL, and DOCKER deployment environments.
 * 
 * WARNING: Contains hardcoded database credentials - intentional vulnerability
 */

// Local development configuration
// Used for development on localhost
var config_local = {
    // Database configuration
    "db": {
        "server": "postgres://postgres:postgres@127.0.0.1",  // VULNERABLE: Hardcoded credentials
        "database": "vulnerablenode"
    }
}

// Remote development configuration
// Used for development on remote VM
var config_devel = {
    // Database configuration
    "db": {
        "server": "postgres://postgres:postgres@10.211.55.70",  // VULNERABLE: Hardcoded credentials
        "database": "vulnerablenode"
    }
}

// Docker deployment configuration
// Used when running via docker-compose
var config_docker = {
    // Database configuration
    "db": {
        "server": "postgres://postgres:postgres@postgres_db",  // VULNERABLE: Hardcoded credentials
        "database": "vulnerablenode"
    }
}

// Select appropriate configuration based on STAGE environment variable
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
        // Default to development configuration if STAGE not set
        config = config_devel;
}

// Build complete PostgreSQL connection string
// Format: postgres://user:password@host/database
config.db.connectionString = config.db.server + "/" + config.db.database

// Export configuration object for use throughout the application
module.exports = config;