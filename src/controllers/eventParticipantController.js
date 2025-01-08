const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const listParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;

    const participants = await prisma.eventParticipant.findMany({
      where: { eventId },
      include: {
        user: true,
      },
    });

    res.json(participants);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const respondToInvitation = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.userId;
    const { status } = req.body;

    if (!["CONFIRMED", "DECLINED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedParticipant = await prisma.eventParticipant.update({
      where: {
        eventId_userId: { eventId, userId },
      },
      data: { status },
    });

    res.json(updatedParticipant);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  listParticipants,
  respondToInvitation,
};
