import { Router } from 'express';
import { getAllResultsForQuiz, getAllResultsForUser, getResultById, createResult } from '../controllers/resultController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/getAllResultsByQuiz/:quizId', authenticateToken, getAllResultsForQuiz); 
router.get('/users/:userId/results', getAllResultsForUser);
router.get('/results/:id', getResultById);
router.post('/results', createResult);

export default router;
