const dotenv = require("dotenv");
const path = require("path");

const envPath =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: path.resolve(process.cwd(), envPath) });

const config = {
  port: process.env.PORT || 3000,
  isProduction: process.env.NODE_ENV === "production",
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
};

module.exports = config;
