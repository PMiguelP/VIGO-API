const { z } = require("zod");

// Schema for updating user details
const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6).optional(),
});

// Schema for selecting profile picture
const profilePictureSchema = z.object({
  profilePictureUrl: z.string().url(),
});

module.exports = {
  updateUserSchema,
  profilePictureSchema,
};
