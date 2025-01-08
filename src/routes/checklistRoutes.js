const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  createChecklist,
  getChecklistsByItinerary,
} = require("../controllers/checklistController");

const router = express.Router();

router.post("/itineraries/:id", authMiddleware, createChecklist); // Create checklist
router.get("/itineraries/:id", authMiddleware, getChecklistsByItinerary); // Get checklists

module.exports = router;
