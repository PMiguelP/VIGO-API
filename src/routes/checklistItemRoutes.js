const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  createChecklistItem,
  getChecklistItems,
  updateChecklistItem,
  deleteChecklistItem,
  getChecklistItemPhotos,
} = require("../controllers/checklistItemController");

const router = express.Router();

router.post("/checklist/:id", authMiddleware, createChecklistItem);
router.get("/checklist/:id", authMiddleware, getChecklistItems);
router.put("/checklist/item/:id", authMiddleware, updateChecklistItem);
router.delete("/checklist/item/:id", authMiddleware, deleteChecklistItem);
router.get("/photos/:id", authMiddleware, getChecklistItemPhotos);

module.exports = router;
