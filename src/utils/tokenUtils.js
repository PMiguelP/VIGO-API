const jwt = require("jsonwebtoken");
const prisma = require("../prisma/prisma");

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "5m" });
};

const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
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

module.exports = { generateAccessToken, generateRefreshToken };
