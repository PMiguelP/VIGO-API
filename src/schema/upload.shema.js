const { z } = require("zod");

// Schema for validating image upload
const uploadImageSchema = z.object({
  imageUrl: z.string().url(),
});

module.exports = {
  uploadImageSchema,
};
