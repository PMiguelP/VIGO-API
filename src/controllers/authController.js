const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenUtils");

const prisma = new PrismaClient();
const isProduction = process.env.NODE_ENV === "production";

const authController = {
  checkAuth: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.userId } });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      res.json({
        isAuthenticated: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error checking authentication status.", error });
    }
  },

  register: async (req, res) => {
    const { email, password, name } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });

      res.status(201).json({ message: "User registered successfully!", user });
    } catch (error) {
      res.status(500).json({ message: "Error registering user.", error });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const accessToken = generateAccessToken(user.id);
      const refreshToken = await generateRefreshToken(user.id);

      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        maxAge: 5 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({ message: "Login successful.", accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: "Error logging in.", error });
    }
  },

  refreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required." });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        return res.status(401).json({ message: "Refresh token invalid or expired." });
      }

      const newAccessToken = generateAccessToken(decoded.id);
      const newRefreshToken = await generateRefreshToken(decoded.id);

      await prisma.refreshToken.delete({ where: { token: refreshToken } });

      res.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        maxAge: 5 * 60 * 1000,
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json({ message: "Token refreshed successfully.", accessToken: newAccessToken });
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired refresh token." });
    }
  },

  logout: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }

    res.clearCookie("token");
    res.clearCookie("refreshToken");

    res.json({ message: "Logout successful." });
  },
};

module.exports = authController;
