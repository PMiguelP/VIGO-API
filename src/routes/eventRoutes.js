// routes/eventRoutes.js
const express = require("express");
const router = express.Router();

// Middlewares
const { validateEvent } = require("../middlewares/validation.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const { isEventOwner } = require("../middlewares/isEventOwner.middleware");

// Controllers
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  updateShareLink,
} = require("../controllers/eventController");

const {
  listParticipants,
  respondToInvitation,
} = require("../controllers/eventParticipantController");

// Event Routes (CRUD operations)
router.post("/create", authMiddleware, validateEvent, createEvent);
router.get("/all", authMiddleware, getEvents);
router.get("/:id", authMiddleware, getEvent);
router.put("/:id", authMiddleware, isEventOwner, validateEvent, updateEvent);
router.delete("/delete/:id", authMiddleware, isEventOwner, deleteEvent);
router.put("/:id/share", authMiddleware, isEventOwner, updateShareLink);

// Participant Routes (Event participants management)
router.get("/:id/participants", listParticipants); // Get participants for an event
router.patch("/:id/respond", respondToInvitation); // Respond to invitation (accept/decline)

module.exports = router;
