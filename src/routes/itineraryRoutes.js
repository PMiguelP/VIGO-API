const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  createItinerary,
  getItinerariesByEvent,
  updateItinerary,
  deleteItinerary,
  getItinerariesForAllUserEvents,
} = require("../controllers/itineraryController");

const router = express.Router();

router.post("/events/:id/itineraries", authMiddleware, createItinerary);
router.get("/events/:id/itineraries", authMiddleware, getItinerariesByEvent);
router.put("/itineraries/update/:id", authMiddleware, updateItinerary);
router.delete("/itineraries/delete/:id", authMiddleware, deleteItinerary);
router.get("/user/itineraries", authMiddleware, getItinerariesForAllUserEvents);

module.exports = router;
