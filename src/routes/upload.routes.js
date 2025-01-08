const express = require("express");
const uploadController = require("./controllers/uploadController");

const router = express.Router();

// Get pre-seeded profile pictures
router.get("/profile-pictures", uploadController.getPreseededProfilePictures);

// Select a profile picture for a user
router.post("/profile-pictures/select", uploadController.selectProfilePicture);

// Upload an image for a checklist item
router.post(
  "/checklist-items/:checklistItemId/upload",
  uploadController.uploadChecklistItemImage
);

module.exports = router;
