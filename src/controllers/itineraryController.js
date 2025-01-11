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
        checklists: true,
      },
    });

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching itineraries", error: error.message });
  }
};

const updateItinerary = async (req, res) => {
  const { id } = req.params;
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
  const { id } = req.params;

  try {
    // Check if the itinerary exists
    const itinerary = await prisma.itinerary.findUnique({
      where: { id },
    });

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    // Proceed to delete the itinerary
    await prisma.itinerary.delete({
      where: { id },
    });

    // Return a success message
    res.status(200).json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting itinerary", error: error.message });
  }
};

const getItinerariesForAllUserEvents = async (req, res) => {
  const userId = req.userId; // Agora usamos req.userId como definido pelo authMiddleware

  try {
    // Encontrar todos os eventos onde o usuário está participando
    const events = await prisma.eventParticipant.findMany({
      where: {
        userId, // Apenas filtra pelo userId
      },
      select: {
        eventId: true, // Apenas retorna os IDs dos eventos
      },
    });

    // Se o usuário não estiver em nenhum evento
    if (events.length === 0) {
      return res.status(404).json({ message: "Você não faz parte de nenhum evento." });
    }

    const eventIds = events.map((event) => event.eventId);

    // Agora, busca os itinerários de todos os eventos que o usuário faz parte
    const itineraries = await prisma.itinerary.findMany({
      where: {
        eventId: { in: eventIds },
      },
      include: {
        event: true, // Inclui os detalhes do evento
        checklists: true, // Inclui as checklists associadas
      },
    });

    res.status(200).json(itineraries);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar itinerários", error: error.message });
  }
};

module.exports = {
  createItinerary,
  getItinerariesByEvent,
  updateItinerary,
  deleteItinerary,
  getItinerariesForAllUserEvents,
};
