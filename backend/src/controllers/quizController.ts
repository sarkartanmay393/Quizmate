import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all quizzes
export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        Admin: true,
        questions: true,
      },
    });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve quizzes" });
  }
};

// Get quiz by ID
export const getQuizById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(id) },
      include: {
        Admin: true,
        questions: true,
      },
    });

    if (quiz) {
      res.status(200).json(quiz);
    } else {
      res.status(404).json({ error: "Quiz not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve quiz" });
  }
};

// Create a new quiz
export const createQuiz = async (req: Request, res: Response) => {
  const { title, adminId, questions } = req.body;

  try {
    const newQuiz = await prisma.quiz.create({
      data: {
        title,
        adminId,
        questions: {
          create: questions.map((q: any) => ({
            text: q.text,
            category: q.category,
            answers: {
              create: q.answers.map((a: any) => ({
                text: a.text,
                isCorrect: a.isCorrect,
              })),
            },
          })),
        },
      },
    });
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

// Update quiz by ID
export const updateQuiz = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, adminId, questions } = req.body;

  try {
    const updatedQuiz = await prisma.quiz.update({
      where: { id: Number(id) },
      data: {
        title,
        adminId,
        questions: {
          deleteMany: {}, // Deletes existing questions to avoid duplication
          create: questions.map((q: any) => ({
            text: q.text,
            category: q.category,
            answers: {
              create: q.answers.map((a: any) => ({
                text: a.text,
                isCorrect: a.isCorrect,
              })),
            },
          })),
        },
      },
    });
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to update quiz" });
  }
};

// Delete quiz by ID
export const deleteQuiz = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.quiz.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete quiz" });
  }
};
