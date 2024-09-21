import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all questions for a specific quiz
export const getAllQuestionsForQuiz = async (req: Request, res: Response) => {
  const { quizId } = req.params;
  try {
    const questions = await prisma.question.findMany({
      where: { quizId: Number(quizId) },
      include: {
        answers: true,
      },
    });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve questions" });
  }
};

// Get a single question by ID
export const getQuestionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const question = await prisma.question.findUnique({
      where: { id: Number(id) },
      include: {
        answers: true,
      },
    });

    if (question) {
      res.status(200).json(question);
    } else {
      res.status(404).json({ error: "Question not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve question" });
  }
};

// Create a new question for a specific quiz
export const createQuestionForQuiz = async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const { text, category, answers } = req.body;

  try {
    const newQuestion = await prisma.question.create({
      data: {
        text,
        category,
        quizId: Number(quizId),
        answers: {
          create: answers.map((a: any) => ({
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        },
      },
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: "Failed to create question" });
  }
};

// Update a question by ID
export const updateQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text, category, answers } = req.body;

  try {
    const updatedQuestion = await prisma.question.update({
      where: { id: Number(id) },
      data: {
        text,
        category,
        answers: {
          deleteMany: {}, // Deletes existing answers to avoid duplication
          create: answers.map((a: any) => ({
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        },
      },
    });
    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: "Failed to update question" });
  }
};

// Delete a question by ID
export const deleteQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.question.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete question" });
  }
};
