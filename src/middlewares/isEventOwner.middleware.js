const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const isEventOwner = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const userId = req.userId;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdById !== userId) {
      return res.status(403).json({
        message: "Not authorized - only the event creator can modify this event",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { isEventOwner };
