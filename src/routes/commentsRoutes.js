const express = require("express");
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

// Create a new comment
router.post("/", authMiddleware, commentController.createComment);

// Get a specific comment by ID
router.get("/:id", authMiddleware, commentController.getCommentById);

// Get all comments (with optional filters)
router.get("/all", authMiddleware, commentController.getAllComments);

// Get all comments for a specific event
router.get("/event/:eventId", authMiddleware, commentController.getCommentsForEvent);

// Get all comments for a specific checklist item
router.get(
  "/checklist-item/:checklistItemId",
  authMiddleware,
  commentController.getCommentsForChecklistItem
);

// Update a specific comment
router.patch("/update/:id", authMiddleware, commentController.updateComment);

// Delete a specific comment
router.delete("/delete/:id", authMiddleware, commentController.deleteComment);

module.exports = router;
