import { Router } from 'express';
import { getAllResultsByQuizId, getAllResultsForUser, getResultById, createResult } from '../controllers/resultController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/getAllResultsByQuizId/:quizId', authenticateToken, getAllResultsByQuizId); 
router.get('/getAllResultsForUser', authenticateToken, getAllResultsForUser);

router.get('/getResultById/:id', authenticateToken, getResultById);
router.post('/generateResult', authenticateToken, createResult);

export default router;
