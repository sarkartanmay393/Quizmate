import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all quizzes
export const getAllQuizzes = async (_: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        Admin: true,
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
    res.status(200).json({ quizzes });
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
        questions: {
          include: {
            answers: true,
          },
        }
      },
    });

    if (quiz) {
      res.status(200).json({ quiz });
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
    if (!title || !adminId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (!questions || questions.length === 0) {
      res.status(400).json({ error: "Add at least one question" });
      return;
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      // Check for required question fields
      if (!question.text || !question.category) {
        res.status(400).json({ error: `Question ${i + 1} is missing required fields: text and category` });
        return;
      }

      // Ensure each question has at least one answer
      if (!question.answers || question.answers.length !== 4) {
        res.status(400).json({ error: `Question ${i + 1} must have four answers` });
        return;
      }

      // Validate answers for each question
      for (let j = 0; j < question.answers.length; j++) {
        const answer = question.answers[j];

        // Check for required answer fields
        if (!answer.text || typeof answer.isCorrect !== 'boolean') {
          res.status(400).json({ error: `Answer ${j + 1} for Question ${i + 1} is missing required fields: text and isCorrect` });
          return;
        }
      }
    }

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
export const updateQuizTitle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const updatedQuiz = await prisma.quiz.update({
      where: { id: Number(id) },
      data: {
        title, // Update the title
      },
    });
    res.status(200).json({ updatedQuiz });
  } catch (error) {
    res.status(500).json({ error: "Failed to update quiz" });
  }
};

// Delete quiz by ID
export const deleteQuiz = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedQuiz = await prisma.quiz.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Quiz deleted successfully", deletedQuiz });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete quiz", cause: error?.["meta"]?.['cause'] || error });
  }
};

// Add a new question to a quiz
export const addQuestionToQuiz = async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const { text, category, answers } = req.body;

  try {
    // Step 1: Check if the quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Step 2: Validate the new question
    if (!text || !category) {
      return res.status(400).json({ error: "Question must have text and category" });
    }

    if (!answers || answers.length !== 4) {
      return res.status(400).json({ error: "Question must have four answers" });
    }

    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      if (!answer.text || typeof answer.isCorrect !== 'boolean') {
        return res.status(400).json({ error: `Answer ${i + 1} is missing required fields: text or isCorrect` });
      }
    }

    // Step 4: Add the new question to the quiz
    const newQuestion = await prisma.question.create({
      data: {
        text,
        category,
        quizId: Number(quizId), // Link the question to the quiz
        answers: {
          create: answers.map((a: any) => ({
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        },
      },
    });

    // Step 5: Respond with the new question
    res.status(201).json({ message: "Question added successfully", newQuestion });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Failed to add question" });
  }
};
