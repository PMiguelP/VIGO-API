const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");
const { updateUserSchema, profilePictureSchema } = require("../schema/user.schema");

const updateUser = async (req, res) => {
  const { userId } = req.user;
  const { name, email, currentPassword, newPassword } = req.body;

  try {
    updateUserSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid current password" });

    const hashedPassword = newPassword ? await bcrypt.hash(newPassword, 10) : undefined;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const selectProfilePicture = async (req, res) => {
  const { userId } = req.user;
  const { profilePictureUrl } = req.body;

  try {
    profilePictureSchema.parse(req.body);

    await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: profilePictureUrl },
    });

    res.status(200).json({ message: "Profile picture updated successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  updateUser,
  selectProfilePicture,
};
