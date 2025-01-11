const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { isEventOwner } = require("../middlewares/isEventOwner.middleware");

const createChecklist = async (req, res) => {
  const { id: itineraryId } = req.params;
  const { name, description } = req.body;

  try {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
    });

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    const checklist = await prisma.checklist.create({
      data: {
        itineraryId,
        name,
        description,
      },
    });

    res.status(201).json(checklist);
  } catch (error) {
    res.status(500).json({ message: "Error creating checklist", error: error.message });
  }
};

const getChecklistsByItinerary = async (req, res) => {
  const { id: itineraryId } = req.params;

  try {
    const checklists = await prisma.checklist.findMany({
      where: { itineraryId },
      include: {
        checklistItems: true,
      },
    });

    res.status(200).json(checklists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching checklists", error: error.message });
  }
};

const updateChecklist = async (req, res) => {
  const { id: checklistId } = req.params;
  const { name, description } = req.body;

  try {
    const checklist = await prisma.checklist.findUnique({
      where: { id: checklistId },
    });

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    const updatedChecklist = await prisma.checklist.update({
      where: { id: checklistId },
      data: {
        name,
        description,
      },
    });

    res.status(200).json(updatedChecklist);
  } catch (error) {
    res.status(500).json({ message: "Error updating checklist", error: error.message });
  }
};

const deleteChecklist = async (req, res) => {
  const { id: checklistId } = req.params;

  try {
    const checklist = await prisma.checklist.findUnique({
      where: { id: checklistId },
    });

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    await prisma.checklist.delete({
      where: { id: checklistId },
    });

    res.status(200).json({ message: "Checklist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting checklist", error: error.message });
  }
};

const getChecklistById = async (req, res) => {
  const { id: checklistId } = req.params;

  try {
    const checklist = await prisma.checklist.findUnique({
      where: { id: checklistId },
      include: {
        checklistItems: true,
      },
    });

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    res.status(200).json(checklist);
  } catch (error) {
    res.status(500).json({ message: "Error fetching checklist", error: error.message });
  }
};

module.exports = {
  createChecklist,
  getChecklistsByItinerary,
  updateChecklist,
  deleteChecklist,
  getChecklistById,
};
