const { PrismaClient } = require("@prisma/client");
const { put } = require("@vercel/blob");
const multer = require("multer");

// Initialize Prisma Client
const prisma = new PrismaClient();

// Set up multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Controller function to upload a photo
const uploadPhotoToBlob = async (req, res) => {
  const file = req.file; // The file from Multer middleware
  const { checklistItemId } = req.body; // The checklist item ID

  // Check if file or checklistItemId is missing
  if (!file) {
    return res.status(400).json({ error: "No file provided." });
  }

  if (!checklistItemId) {
    return res.status(400).json({ error: "Checklist item ID is required." });
  }

  // Get the user ID from the middleware
  const userId = req.userId; // Extract userId set by authMiddleware

  try {
    // Validate user existence
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ error: "User not found." });
    }

    // Validate checklist item existence
    const checklistItemExists = await prisma.checklistItem.findUnique({
      where: { id: checklistItemId },
    });

    if (!checklistItemExists) {
      return res.status(404).json({ error: "Checklist item not found." });
    }

    // Step 1: Upload the file to Vercel Blob
    const blobResult = await put(file.originalname, file.buffer, {
      access: "public", // Make the file publicly accessible
    });

    // Extract the public URL of the uploaded file
    const fileUrl = blobResult.url;

    // Step 2: Save the file URL in the database
    const uploadRecord = await prisma.upload.create({
      data: {
        userId,
        checklistItemId,
        uploadType: "CHECKLIST_ITEM_IMAGE",
        fileUrl,
      },
    });

    // Step 3: Respond with the uploaded file's URL
    return res.status(201).json({
      message: "File uploaded successfully.",
      upload: uploadRecord,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ error: "File upload failed." });
  }
};

// Middleware for handling file uploads
const uploadMiddleware = upload.single("file");

// Export the function and middleware
module.exports = {
  uploadPhotoToBlob,
  uploadMiddleware,
};
