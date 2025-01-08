const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { isEventOwner } = require("../middlewares/isEventOwner.middleware");

const createItinerary = [
  isEventOwner,
  async (req, res) => {
    const { id: eventId } = req.params;
    const { name, description, startDate, endDate } = req.body;

    try {
      const itinerary = await prisma.itinerary.create({
        data: {
          eventId,
          name,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
        },
      });

      res.status(201).json(itinerary);
    } catch (error) {
      res.status(500).json({ message: "Error creating itinerary", error: error.message });
    }
  },
];

const getItinerariesByEvent = async (req, res) => {
  const { id: eventId } = req.params;

  try {
    const itineraries = await prisma.itinerary.findMany({
      where: { eventId },
      include: {
        checklists: true, // Include related checklists for completeness
      },
    });

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching itineraries", error: error.message });
  }
};

// Update an itinerary
const updateItinerary = async (req, res) => {
  const { id } = req.params; // Itinerary ID
  const { name, description, startDate, endDate } = req.body;

  try {
    const itinerary = await prisma.itinerary.update({
      where: { id },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    res.status(200).json(itinerary);
  } catch (error) {
    res.status(500).json({ message: "Error updating itinerary", error: error.message });
  }
};

const deleteItinerary = async (req, res) => {
  const { id } = req.params; // Itinerary ID

  try {
    await prisma.itinerary.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting itinerary", error: error.message });
  }
};

module.exports = {
  createItinerary,
  getItinerariesByEvent,
  updateItinerary,
  deleteItinerary,
};
