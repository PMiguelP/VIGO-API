const express = require("express");
const { updateUser, selectProfilePicture } = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Update user details
router.put("/update", authMiddleware, updateUser);

// Select profile picture
router.post("/profile-picture", authMiddleware, selectProfilePicture);

module.exports = router;
