/** Common config for message.ly */

// Read .env files and set environmental variables
require("dotenv").config();

// Database URI based on the environment
const DB_URI = process.env.NODE_ENV === "test" ? "postgresql:///messagely_test" : "postgresql:///messagely";

// Secret key for JWT authentication
const SECRET_KEY = process.env.SECRET_KEY || "secret";

// Work factor for bcrypt password hashing
const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
};