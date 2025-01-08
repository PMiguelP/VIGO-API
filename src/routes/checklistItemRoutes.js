const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  createChecklistItem,
  getChecklistItems,
} = require("../controllers/checklistItemController");

const router = express.Router();

router.post("/checklist/:id", authMiddleware, createChecklistItem);
router.get("/checklist/:id", authMiddleware, getChecklistItems);

module.exports = router;
