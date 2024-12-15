const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:8100",
      "https://project-vigo.vercel.app",
      "http://localhost:4200",
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

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

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired.", tokenExpired: true });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
};

// New /auth/check route
app.get("/auth/check", authMiddleware, async (req, res) => {
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
});

app.post("/auth/register", async (req, res) => {
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
});

app.post("/auth/login", async (req, res) => {
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
});

app.post("/auth/refresh", async (req, res) => {
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
});

app.post("/auth/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }

  res.clearCookie("token");
  res.clearCookie("refreshToken");

  res.json({ message: "Logout successful." });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
