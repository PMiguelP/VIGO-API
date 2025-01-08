const prisma = require("@prisma/client");
const { PrismaClient } = prisma;
const prismaClient = new PrismaClient();

exports.createComment = async (req, res) => {
  const { userId, commentType, eventId, checklistItemId, comment } = req.body;

  try {
    const newComment = await prismaClient.comment.create({
      data: {
        userId,
        commentType,
        eventId,
        checklistItemId,
        comment,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating comment" });
  }
};

exports.getCommentById = async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await prismaClient.comment.findUnique({
      where: { id },
    });
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving comment" });
  }
};

exports.getAllComments = async (req, res) => {
  const { eventId, checklistItemId, userId } = req.query;

  try {
    const comments = await prismaClient.comment.findMany({
      where: {
        eventId: eventId || undefined,
        checklistItemId: checklistItemId || undefined,
        userId: userId || undefined,
      },
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving comments" });
  }
};

exports.getCommentsForEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const comments = await prismaClient.comment.findMany({
      where: { eventId },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving comments for event" });
  }
};

exports.getCommentsForChecklistItem = async (req, res) => {
  const { checklistItemId } = req.params;

  try {
    const comments = await prismaClient.comment.findMany({
      where: { checklistItemId },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error retrieving comments for checklist item" });
  }
};

exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  try {
    const updatedComment = await prismaClient.comment.update({
      where: { id },
      data: { comment },
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating comment" });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    await prismaClient.comment.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting comment" });
  }
};
