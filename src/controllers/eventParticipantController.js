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
    // Add debugging logs
    console.log("Request params:", req.params);
    console.log("Request userId:", req.userId);
    console.log("Request body:", req.body);

    // Change this line to use req.params.id instead of eventId
    const eventId = req.params.id; // This matches your route parameter
    const userId = req.userId;
    const { status } = req.body;

    // Debug values
    console.log("Extracted values:", {
      eventId,
      userId,
      status,
    });

    // Validate inputs
    if (!eventId || !userId) {
      return res.status(400).json({
        message: "Missing eventId or userId",
        debug: {
          eventId: eventId || "missing",
          userId: userId || "missing",
          params: req.params,
          body: req.body,
        },
      });
    }

    // Validate status using the enum from your schema
    if (!["PENDING", "CONFIRMED", "DECLINED", "INVITED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: PENDING, CONFIRMED, DECLINED, INVITED",
      });
    }

    // Check if the participant exists
    const existingParticipant = await prisma.eventParticipant.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (!existingParticipant) {
      // Create new participant
      const newParticipant = await prisma.eventParticipant.create({
        data: {
          eventId,
          userId,
          status,
          role: "PARTICIPANT",
        },
      });
      return res.status(201).json(newParticipant);
    }

    // Update existing participant
    const updatedParticipant = await prisma.eventParticipant.update({
      where: {
        id: existingParticipant.id,
      },
      data: {
        status,
      },
    });

    res.json(updatedParticipant);
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      details: {
        eventId: req.params.id, // Changed to match the route parameter
        userId: req.userId,
        status: req.body.status,
        params: req.params,
        body: req.body,
      },
    });
  }
};

module.exports = {
  listParticipants,
  respondToInvitation,
};
