const express = require("express");
const {
  uploadPhotoToBlob,
  uploadMiddleware,
} = require("../controllers/upload.controller");
const authMiddleware = require("../middlewares/auth.middleware"); // Adjust the path as needed
const router = express.Router();

// File upload route with authentication middleware
router.post("/upload-photo", authMiddleware, uploadMiddleware, uploadPhotoToBlob);

module.exports = router;
