import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { checkScoreAndTimeTaken, QuizAttemptReport } from '../utils';

const prisma = new PrismaClient();

// Get all results for a specific quiz by admin
export const getAllResultsByQuizId = async (req: AuthenticatedRequest, res: Response) => {
  const { quizId } = req.params;
  const { userId, role } = req.user as any;

  try {
    if (role !== 'admin') {
      res.status(403).json({ error: "You are not authorized to retrieve all results for this quiz" });
      return;
    }

    const quizWithResults = await prisma.quiz.findUnique({
      where: { id: Number(quizId), adminId: Number(userId) },
      include: {
        results: true
      }
    });

    res.status(200).json({ results: quizWithResults?.results ?? [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve results" });
  }
};

// Get all results for a specific user
export const getAllResultsForUser = async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.user as any;

  try {
    const results = await prisma.result.findMany({
      where: { userId: Number(userId) },
      include: {
        Quiz: true,
      },
    });
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve results" });
  }
};

// Get result by ID
export const getResultById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role } = req.user as any;

  try {
    if (role !== 'admin') {
      res.status(403).json({ error: "You are not authorized to retrieve this result by id." });
      return;
    }

    const result = await prisma.result.findUnique({
      where: { id: Number(id) },
      include: {
        User: {
          select: {
            name: true,
            email: true,
          },
        },
        Quiz: true,
      },
    });

    if (result) {
      res.status(200).json({ result });
    } else {
      res.status(404).json({ error: "Result not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve result" });
  }
};

// Create a new result
export const createResult = async (req: AuthenticatedRequest, res: Response) => {
  const { quizReport } = req.body as { quizReport: QuizAttemptReport };
  const { userId, role } = req.user as any;

  try {
    if (role !== 'interviewee') {
      res.status(403).json({ error: "You are not authorized to attempt a quiz!" });
      return;
    }

    const existingResult = await prisma.result.findFirst({
      where: { userId: Number(userId), quizId: Number(quizReport.quizId) },
    });

    if (existingResult) {
      res.status(409).json({ error: "You have already attempted this quiz!" });
      return;
    }

    const newResult = await prisma.$transaction(async (prisma) => {
      const quizWithQnA = await prisma.quiz.findUnique({
        where: { id: quizReport.quizId },
        include: {
          questions: {
            include: {
              answers: true,
            },
          },
        },
      });

      if (!quizWithQnA) {
        throw new Error("Quiz not found");
      }

      const { score, timeTaken, detailedResults } = checkScoreAndTimeTaken(quizReport.userSelectedAnswers, quizWithQnA?.questions);

      if (score === null || timeTaken === null) {
        throw new Error("Invalid answers");
      }

      const newResult = await prisma.result.create({
        data: {
          userId: Number(userId),
          quizId: Number(quizReport.quizId),
          score,
          timeTaken,
          detailed: JSON.parse(JSON.stringify(detailedResults)),
        },
      });

      return newResult;
    });

    res.status(201).json({ newResult });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Failed to create result", cause: JSON.stringify(error) });
  }
};