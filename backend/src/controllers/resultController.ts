import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all results for a specific quiz
export const getAllResultsForQuiz = async (req: Request, res: Response) => {
  const { quizId } = req.params;
  try {
    const results = await prisma.result.findMany({
      where: { quizId: Number(quizId) },
      include: {
        User: true,
        Quiz: true,
      },
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve results" });
  }
};

// Get all results for a specific user
export const getAllResultsForUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const results = await prisma.result.findMany({
      where: { userId: Number(userId) },
      include: {
        Quiz: true,
      },
    });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve results" });
  }
};

// Get result by ID
export const getResultById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await prisma.result.findUnique({
      where: { id: Number(id) },
      include: {
        User: true,
        Quiz: true,
      },
    });

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ error: "Result not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve result" });
  }
};

// Create a new result
export const createResult = async (req: Request, res: Response) => {
  const { userId, quizId, score, timeTaken } = req.body;

  try {
    const newResult = await prisma.result.create({
      data: {
        userId: Number(userId),
        quizId: Number(quizId),
        score,
        timeTaken,
      },
    });
    res.status(201).json(newResult);
  } catch (error) {
    res.status(500).json({ error: "Failed to create result" });
  }
};

// Update result by ID
export const updateResult = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { score, timeTaken } = req.body;

  try {
    const updatedResult = await prisma.result.update({
      where: { id: Number(id) },
      data: {
        score,
        timeTaken,
      },
    });
    res.status(200).json(updatedResult);
  } catch (error) {
    res.status(500).json({ error: "Failed to update result" });
  }
};

// Delete result by ID
export const deleteResult = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.result.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete result" });
  }
};
