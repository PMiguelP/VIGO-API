const { PrismaClient } = require("@prisma/client");

// Prevent multiple Prisma Client instances in development
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

module.exports = prisma;
