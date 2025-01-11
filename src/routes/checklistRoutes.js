const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  createChecklist,
  getChecklistsByItinerary,
  deleteChecklist,
  updateChecklist,
  getChecklistById,
} = require("../controllers/checklistController");

const router = express.Router();

router.post("/itineraries/:id", authMiddleware, createChecklist);
router.get("/itineraries/:id", authMiddleware, getChecklistsByItinerary);
router.delete("/itineraries/delete/:id", authMiddleware, deleteChecklist);
router.put("/itineraries/update:id", authMiddleware, updateChecklist);
router.get("/:id", authMiddleware, getChecklistById);

module.exports = router;
