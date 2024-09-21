import { Router } from 'express';
import { getAllResultsForQuiz, getAllResultsForUser, getResultById, createResult, updateResult, deleteResult } from '../controllers/resultController';

const router = Router();

router.get('/getAllResultsForQuiz/:quizId', getAllResultsForQuiz);   // Get all results for a specific quiz
router.get('/users/:userId/results', getAllResultsForUser);   // Get all results for a specific user
router.get('/results/:id', getResultById);                    // Get a specific result by ID
router.post('/results', createResult);                        // Create a new result

export default router;
