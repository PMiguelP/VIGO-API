const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const config = require("../config/environment");

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, { expiresIn: "7d" });
};

const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign({ id: userId }, config.jwtRefreshSecret, {
    expiresIn: "30d",
  });
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId,
    },
  });
  return refreshToken;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
