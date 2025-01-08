const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const BLOB_API_URL = "https://vercel.blob/api/v1/blobs";
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

exports.getPreseededProfilePictures = async (req, res) => {
  try {
    const preseededUrls = Array.from({ length: 20 }, (_, i) => ({
      id: `profile-picture-${i + 1}`,
      url: `https://vercel.blob/storage/profile-pictures/image-${i + 1}.jpg`,
      description: `Profile picture ${i + 1}`,
    }));

    res.status(200).json(preseededUrls);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch pre-seeded profile pictures." });
  }
};

exports.selectProfilePicture = async (req, res) => {
  const { userId, profilePictureUrl } = req.body;

  if (!userId || !profilePictureUrl) {
    return res
      .status(400)
      .json({ error: "User ID and Profile Picture URL are required." });
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { profilePictureUrl },
    });

    res.status(200).json({ message: "Profile picture updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile picture." });
  }
};

// Upload an image for a checklist item
exports.uploadChecklistItemImage = async (req, res) => {
  const { checklistItemId } = req.params;

  if (!checklistItemId) {
    return res.status(400).json({ error: "Checklist item ID is required." });
  }

  try {
    const contentType = req.headers["content-type"];
    const chunks = [];

    // Collect the data chunks
    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", async () => {
      const fileBuffer = Buffer.concat(chunks);

      // Upload to Vercel Blob
      const uploadResponse = await axios.post(
        `${BLOB_API_URL}/write`,
        {
          fileName: `checklist-item-${checklistItemId}.jpg`,
          data: fileBuffer.toString("base64"),
        },
        {
          headers: {
            Authorization: `Bearer ${BLOB_READ_WRITE_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { url } = uploadResponse.data;

      // Update the checklist item in the database
      await prisma.checklistItem.update({
        where: { id: checklistItemId },
        data: {
          uploads: {
            create: {
              uploadType: "CHECKLIST_ITEM_IMAGE",
              fileUrl: url,
              description: `Image for checklist item ${checklistItemId}`,
            },
          },
        },
      });

      res
        .status(200)
        .json({ message: "Image uploaded and linked to checklist item.", url });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload image for the checklist item." });
  }
};
