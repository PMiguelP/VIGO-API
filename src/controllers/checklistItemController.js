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
    status,
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
        status,
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
const updateChecklistItem = async (req, res) => {
  const { id: checklistItemId } = req.params;
  const updateData = req.body;

  try {
    const checklistItem = await prisma.checklistItem.findUnique({
      where: { id: checklistItemId },
    });

    if (!checklistItem) {
      return res.status(404).json({ message: "Checklist item not found" });
    }

    const updatedChecklistItem = await prisma.checklistItem.update({
      where: { id: checklistItemId },
      data: updateData,
    });

    res.status(200).json(updatedChecklistItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating checklist item", error: error.message });
  }
};

const deleteChecklistItem = async (req, res) => {
  const { id: checklistItemId } = req.params;

  try {
    const checklistItem = await prisma.checklistItem.findUnique({
      where: { id: checklistItemId },
    });

    if (!checklistItem) {
      return res.status(404).json({ message: "Checklist item not found" });
    }

    await prisma.checklistItem.delete({
      where: { id: checklistItemId },
    });

    res.status(200).json({ message: "Checklist item deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting checklist item", error: error.message });
  }
};

const getChecklistItemPhotos = async (req, res) => {
  const { id: checklistItemId } = req.params;

  try {
    // Fetch checklist item by ID
    const checklistItem = await prisma.checklistItem.findUnique({
      where: { id: checklistItemId },
      include: {
        uploads: true, // This includes all uploads (photos) for this checklist item
      },
    });

    // If the checklist item is not found
    if (!checklistItem) {
      return res.status(404).json({ message: "Checklist item not found" });
    }

    // Extract URLs of all photos (uploads) associated with this checklist item
    const photoUrls = checklistItem.uploads.map((upload) => upload.fileUrl);

    // Return the list of photo URLs
    return res.status(200).json({
      message: "Photos fetched successfully",
      photos: photoUrls,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching photos for checklist item",
      error: error.message,
    });
  }
};

module.exports = {
  createChecklistItem,
  getChecklistItems,
  updateChecklistItem,
  deleteChecklistItem,
  getChecklistItemPhotos,
};
