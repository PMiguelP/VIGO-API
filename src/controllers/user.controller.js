const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const getAllPresetProfilePictures = async () => {
  try {
    const presetProfilePictures = await prisma.presetProfilePicture.findMany({
      select: {
        id: true,
        url: true,
        description: true,
        category: true,
        createdAt: true,
      },
    });

    return presetProfilePictures;
  } catch (error) {
    console.error("Error fetching preset profile pictures:", error);
    throw error;
  }
};

const selectProfilePicture = async (userId, presetProfilePictureId) => {
  try {
    // First verify the preset picture exists
    const pictureExists = await prisma.presetProfilePicture.findUnique({
      where: { id: presetProfilePictureId },
      select: { id: true },
    });

    if (!pictureExists) {
      throw new Error("Profile picture not found");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        presetProfilePictureId: presetProfilePictureId,
        profilePictureUrl: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        presetProfilePicture: {
          select: {
            url: true,
          },
        },
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error selecting profile picture:", error);
    throw error;
  }
};
const updateUserProfile = async (userId, currentPassword, newPassword, newName) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    const updatedData = {};

    // If new name is provided, update it
    if (newName) {
      updatedData.name = newName;
    }

    // If new password is provided, hash and update it
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updatedData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
const getUserInfo = async (userId) => {
  try {
    const userInfo = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profilePictureUrl: true,
        presetProfilePicture: {
          select: {
            url: true,
            description: true,
            category: true,
          },
        },
        events: {
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
          },
        },
        eventParticipants: {
          select: {
            event: {
              select: {
                id: true,
                name: true,
              },
            },
            status: true,
            role: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!userInfo) {
      console.error("User not found for ID:", userId);
      throw new Error("User not found");
    }

    return userInfo;
  } catch (error) {
    console.error("Error fetching user info for ID:", userId, error);
    throw error;
  }
};

module.exports = {
  getAllPresetProfilePictures,
  selectProfilePicture,
  updateUserProfile,
  getUserInfo,
};
