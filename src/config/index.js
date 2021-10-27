require("dotenv").config();

// Database conection
module.exports.MONGODB_URL = process.env.MONGODB_URL ?? "";

// Authenticated
module.exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? "";

// Api
module.exports.PORT = process.env.PORT ?? 3000;

// Storage
module.exports.CLOUD_NAME = process.env.CLOUD_NAME ?? "";
module.exports.API_KEY = process.env.API_KEY ?? "";
module.exports.API_SECRET = process.env.API_SECRET ?? "";

// Capcha
module.exports.CAPCHA_BASE_URL = process.env.CAPCHA_BASE_URL ?? "";
module.exports.CAPCHA_SECRET_KEY = process.env.CAPCHA_SECRET_KEY ?? "";