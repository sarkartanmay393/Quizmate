import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import generateInviteCode from '../utils/generateInviteCode';

const prisma = new PrismaClient();

// Get all quizzes created by the admin
export const getAllQuizzesByAdmin = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.user as any;

  try {
    if (!userId) {
      res.status(401).json({ error: "Unauthorized to retrieve quizzes" });
      return;
    }

    const quizzes = await prisma.quiz.findMany({
      where: { adminId: Number(userId) },
    });
    res.status(200).json({ quizzes });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve quizzes" });
  }
};

// Get quiz by ID
export const getQuizById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user as any;

  try {
    if (!userId) {
      res.status(400).json({ error: "Unauthorized to retrieve quizzes" });
      return;
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(id), adminId: Number(userId) },
      include: {
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

// Get quiz by Invite Code
export const getQuizByInviteCode = async (req: AuthenticatedRequest, res: Response) => {
  const { inviteCode } = req.params;
  const { role } = req.user as any;

  try {
    if (!inviteCode) {
      res.status(400).json({ error: "Missing invite code" });
      return;
    }

    if (role !== 'interviewee') {
      res.status(403).json({ error: "You are not an interviewee!" });
      return;
    }

    const quiz = await prisma.quiz.findUnique({
      where: { inviteCode: inviteCode },
      include: {
        questions: {
          include: {
            answers: {
              select: {
                text: true,
                id: true,
              }
            },
          },
        }
      },
    });

    if (quiz) {
      res.status(200).json({ quiz });
    } else {
      res.status(404).json({ error: "Quiz not found" });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to retrieve quiz", cause: error?.["meta"]?.['cause'] || error });
  }
};

// Create a new quiz
export const createQuiz = async (req: AuthenticatedRequest, res: Response) => {
  const { title, questions } = req.body;
  const { userId, role } = req.user as any;

  try {
    if (!userId) {
      res.status(401).json({ error: "Unauthorized to create a quiz" });
      return;
    }

    if (role !== 'admin') {
      res.status(403).json({ error: "You are not authorized to create a quiz" });
      return;
    }

    if (!title) {
      res.status(400).json({ error: "Missing title fields" });
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
      let foundCorrectAnswer = false;
      for (let j = 0; j < question.answers.length; j++) {
        const answer = question.answers[j];

        if (answer.isCorrect && foundCorrectAnswer) {
          res.status(400).json({ error: `Answer ${j + 1} for Question ${i + 1} is incorrect because it is marked as correct` });
          return;
        }

        if (answer.isCorrect) {
          foundCorrectAnswer = true;
        }

        // Check for required answer fields
        if (!answer.text || typeof answer.isCorrect !== 'boolean') {
          res.status(400).json({ error: `Answer ${j + 1} for Question ${i + 1} is missing required fields: text and isCorrect` });
          return;
        }
      }
    }

    // Transaction to create the quiz and invite code atomically
    const [newQuiz] = await prisma.$transaction(async (prisma) => {
      const quiz = await prisma.quiz.create({
        data: {
          title,
          adminId: Number(userId),
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
          }
        },
      });

      const inviteCode = await prisma.inviteCode.create({
        data: {
          quizId: quiz.id,
          adminId: Number(userId),
          code: generateInviteCode(),
        },
      });

      const newQuiz = await prisma.quiz.update({
        where: { id: quiz.id },
        data: {
          inviteCode: inviteCode.code,
        },
      });

      return [newQuiz];
    });

    res.status(201).json({ newQuiz });
  } catch (error) {
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

// Update quiz by ID
export const updateQuizTitle = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  const { userId, role } = req.user as any; // Extract the userId from the authenticated user

  try {
    // Step 1: Check if the quiz exists and was created by the authenticated user
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(id) },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Step 2: Check if the authenticated user is the creator of the quiz
    if (quiz.adminId !== userId) {
      return res.status(403).json({ error: "You are not authorized to update this quiz" });
    }

    // Step 3: Proceed with updating the quiz title if the user is authorized
    const updatedQuiz = await prisma.quiz.update({
      where: { id: Number(id) },
      data: {
        title, // Update the title
      },
    });

    return res.status(200).json({ updatedQuiz });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update quiz" });
  }
};

// Delete quiz by ID
export const deleteQuiz = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req.user as any;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(id) },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Step 2: Check if the authenticated user is the creator of the quiz
    if (quiz.adminId !== userId) {
      return res.status(403).json({ error: "You are not authorized to delete this quiz" });
    }

    const deletedQuiz = await prisma.quiz.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Quiz deleted successfully", deletedQuiz });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete quiz", cause: error?.["meta"]?.['cause'] || error });
  }
};

// Add a new question to a quiz
export const addQuestionToQuiz = async (req: AuthenticatedRequest, res: Response) => {
  const { quizId } = req.params;
  const { text, category, answers } = req.body;
  const { userId } = req.user as any;

  try {
    // Step 1: Check if the quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id: Number(quizId) },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    if (quiz.adminId !== userId) {
      return res.status(403).json({ error: "You are not authorized to add questions to this quiz" });
    }

    // Step 2: Validate the new question
    if (!text || !category) {
      return res.status(400).json({ error: "Question must have text and category" });
    }

    if (!answers || answers.length !== 4) {
      return res.status(400).json({ error: "Question must have four answers" });
    }

    let foundCorrectAnswer = false;
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i];
      if (answer.isCorrect && foundCorrectAnswer) {
        res.status(400).json({ error: `This question has multiple correct answers` });
        return;
      }

      if (answer.isCorrect) {
        foundCorrectAnswer = true;
      }
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

