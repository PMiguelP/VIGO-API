const { z } = require("zod");

const eventSchema = z.object({
  name: z
    .string()
    .min(1, "Event name is required")
    .max(255, "Event name must be less than 255 characters")
    .transform((value) => value.trim()),

  description: z
    .string()
    .optional()
    .refine((value) => !value || value.length <= 1000, {
      message: "Description must be less than 1000 characters",
    })
    .transform((value) => (value ? value.trim() : value)),

  destiny: z
    .string()
    .min(1, "Destiny is required")
    .max(255, "Destiny must be less than 255 characters")
    .transform((value) => value.trim()),

  startDate: z.string().refine((value) => new Date(value) >= new Date(), {
    message: "Start date cannot be in the past",
  }),

  endDate: z.string().refine(
    (value, ctx) => {
      const startDate = new Date(ctx?.parent?.startDate || Date.now());
      const endDate = new Date(value);
      return endDate >= startDate;
    },
    { message: "End date must be after start date" }
  ),
});

module.exports = {
  eventSchema,
};
