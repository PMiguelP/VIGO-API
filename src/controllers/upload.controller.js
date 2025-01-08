const { Blob } = require("@vercel/blob");
const prisma = require("../config/prisma");
const { uploadImageSchema } = require("../schemas/upload.schema");

const blob = new Blob({
  token: process.env.BLOB_READ_WRITE_TOKEN,
});

const seedProfilePictures = async () => {
  const profilePictures = [
    {
      url: "https://ve0qydkpmobcurcu.public.blob.vercel-storage.com/Avatar1-pXM4tDEgjA10xEIXNo2DqWSJOuVima.png",
      description: "Avatar 1",
    },
    {
      url: "https://example.com/image2.jpg",
      description: "Picture 2",
    },
  ];

  for (const picture of profilePictures) {
    await prisma.profilePicture.upsert({
      where: { url: picture.url },
      update: {},
      create: { url: picture.url, description: picture.description },
    });
  }

  console.log("Profile pictures seeded successfully!");
};

// Get all profile pictures
const getProfilePictures = async (req, res) => {
  try {
    const profilePictures = await prisma.profilePicture.findMany();
    res.status(200).json(profilePictures);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile pictures" });
  }
};

// Upload an image to Vercel Blob and save its URL
const uploadImage = async (req, res) => {
  const { fileName, fileBuffer } = req.body;

  try {
    // Validate input (you can add more validations as needed)
    if (!fileName || !fileBuffer) {
      throw new Error("Invalid input: fileName and fileBuffer are required.");
    }

    // Upload the file to Vercel Blob
    const { url } = await blob.put(fileName, Buffer.from(fileBuffer), {
      contentType: "image/jpeg", // Adjust based on the file type
      access: "public",
    });

    // Save the uploaded image URL to the database
    const uploadedImage = await prisma.upload.create({
      data: { url },
    });

    res.status(201).json({ message: "Image uploaded successfully", uploadedImage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  seedProfilePictures,
  getProfilePictures,
  uploadImage,
};
