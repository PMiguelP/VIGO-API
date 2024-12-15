const express = require("express");
const {
  checkAuth,
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/check", authMiddleware, checkAuth);
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

module.exports = router;
