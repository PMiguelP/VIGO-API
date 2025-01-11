const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const {
  getAllPresetProfilePictures,
  selectProfilePicture,
  updateUserProfile,
  getUserInfo,
} = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/profile-pictures", authMiddleware, async (req, res) => {
  try {
    const pictures = await getAllPresetProfilePictures();
    res.json(pictures);
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ error: "Failed to fetch profile pictures" });
  }
});

router.post("/profile-pictures/select", authMiddleware, async (req, res) => {
  try {
    const { presetProfilePictureId } = req.body;

    if (!req.userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!presetProfilePictureId) {
      return res.status(400).json({ error: "Profile picture ID is required" });
    }

    const updatedUser = await selectProfilePicture(req.userId, presetProfilePictureId);
    res.json(updatedUser);
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ error: "Failed to select profile picture" });
  }
});

router.put("/profile-update", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, newName } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ error: "Current password is required" });
    }

    if (!newPassword && !newName) {
      return res.status(400).json({ error: "New password or name is required" });
    }

    const updatedUser = await updateUserProfile(
      req.userId,
      currentPassword,
      newPassword,
      newName
    );

    res.json(updatedUser);
  } catch (error) {
    console.error("Route error:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

router.get("/info", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userInfo = await getUserInfo(userId);
    res.json(userInfo);
  } catch (error) {
    console.error("Route error: Failed to fetch user info:", error.message);
    res.status(500).json({ error: "Failed to fetch user info" });
  }
});

router.get("/info/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // Fetch the user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        presetProfilePicture: {
          select: {
            url: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the user data
    res.json({
      name: user.name,
      presetProfilePictureUrl: user.presetProfilePicture?.url || null,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
