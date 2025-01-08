const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createChecklistItem = async (req, res) => {
  const { id: checklistId } = req.params;
  const {
    name,
    description,
    locationName,
    locationAddress,
    latitude,
    longitude,
    estimatedTime,
  } = req.body;

  try {
    const checklist = await prisma.checklist.findUnique({
      where: { id: checklistId },
    });

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    const checklistItem = await prisma.checklistItem.create({
      data: {
        checklistId,
        name,
        description,
        locationName,
        locationAddress,
        latitude,
        longitude,
        estimatedTime,
      },
    });

    res.status(201).json(checklistItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating checklist item", error: error.message });
  }
};

const getChecklistItems = async (req, res) => {
  const { id: checklistId } = req.params;

  try {
    const checklistItems = await prisma.checklistItem.findMany({
      where: { checklistId },
      include: {
        uploads: true,
        comments: true,
      },
    });

    res.status(200).json(checklistItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching checklist items", error: error.message });
  }
};

module.exports = {
  createChecklistItem,
  getChecklistItems,
};
