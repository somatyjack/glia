/*
    MicroService global configuration file
    --------------------------------------
    path.resolve(__dirname) is resolved to your micro-service directory
*/

const path = require("path");
const error_codes = require("./errorCodes");

const msConfig = {
    PORT: 4010,
    MS_NAME: "glia-testing", // must match folder name
    MS_PATH: path.resolve(__dirname, "../"),
    DEBUG_MODE: true,
    // Database
    DB_DIALECT: "mysql",
    DB_HOST: "localhost",
    DB_PORT: 3306,
    DB_NAME: "",
    DB_USER: "",
    DB_PASSWORD: "",
    DB_CONN_LIMIT: 10,
    // Validation & Sanitization
    VALIDATION_ENABLED: true,
    VALIDATION_SCHEMAS_PATH: path.resolve(__dirname, "../validation"),
    SANITIZATION_ENABLED: true,
    SANITIZATION_SCHEMAS_PATH: path.resolve(__dirname, "../sanitization"),
    // Service logs
    LOGS_ENABLED: false,
    LOGS_PATH: path.resolve(__dirname, "../logs"),
    LOGS_REFRESH_RATE: 1000 * 60,
    savePostActivity: true,
    // Custom Errors handling
    ERRORS_HANDLING_ENABLED: true,
    // TODO: ERRORS_EXTENSION_PATH: path.resolve(__dirname, "../middleware/errors"),
    ERROR_CODES: error_codes,
};

const config = {
    all: {
        host: "local.ie",
        corsWhiteList: () => {
            return [
                undefined,
                "http://localhost:8080",
                "localhost:8080",
                "http://localhost",
                "www.localhost",
                "http://www.localhost",
                "localhost:4010",
                "localhost:4020",
                "localhost:4030",
                "localhost:4040",
                "localhost:8080",
                "localhost:4050",
                "localhost:4060",
                "localhost:4070",
                "localhost:4080",
                "localhost:4090",
                "listing_service",
                "booking_service",
                "core_service",
                "profile_service",
                "user_service",
                "image_service",
                "inbox_service",
                "local.ie",
                "www.local.ie",
                "http://local.ie",
                "http://www.local.ie",
                "inbox.local.ie",
                "notif.local.ie",
                "http://inbox.local.ie",
                "http://notif.local.ie",
            ];
        },
        captchaSecret: "6LceZ8oUAAAAAFg_U269Td9Gp1OJsh3hnUhPY7Iy",
    },
};

config.ms = msConfig;
module.exports = config;
