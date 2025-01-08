const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createEvent = async (req, res) => {
  try {
    const { name, description, destiny, startDate, endDate } = req.body;
    const userId = req.userId;

    const event = await prisma.event.create({
      data: {
        name,
        description,
        destiny,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        createdById: userId,
        shareLink: `${process.env.FRONTEND_URL}/events/${Date.now()}`,
        participants: {
          create: {
            userId: userId,
            role: "ORGANIZER",
            status: "CONFIRMED",
          },
        },
      },
      include: {
        participants: true,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const userId = req.userId;

    const events = await prisma.event.findMany({
      where: {
        OR: [
          { createdById: userId },
          {
            participants: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      include: {
        participants: true,
        itineraries: true,
      },
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        participants: true,
        itineraries: true,
        comments: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, destiny, startDate, endDate } = req.body;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        name,
        description,
        destiny,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateShareLink = async (req, res) => {
  try {
    const { id } = req.params;
    const newShareLink = `${process.env.FRONTEND_URL}/events/${Date.now()}`;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        shareLink: newShareLink,
      },
    });

    res.json({ shareLink: updatedEvent.shareLink });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  updateShareLink,
};
