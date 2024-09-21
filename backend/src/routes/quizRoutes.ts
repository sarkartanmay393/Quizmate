import { Router } from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  getQuizById,
  createQuiz,
  updateQuizTitle,
  deleteQuiz,
  addQuestionToQuiz,
  getAllQuizzesByAdmin,
  getQuizByInviteCode
} from '../controllers/quizController';

const router = Router();

router.get('/getAllQuizzesByAdmin', authenticateToken, getAllQuizzesByAdmin);
router.get('/getQuizById/:id', authenticateToken, getQuizById);
router.get('/getQuizByInviteCode/:inviteCode', authenticateToken, getQuizByInviteCode);

router.put('/updateQuizTitle/:id', authenticateToken, updateQuizTitle);
router.post('/addQuestionToQuiz/:quizId', authenticateToken, addQuestionToQuiz);

router.post('/createQuiz', authenticateToken, createQuiz);
router.delete('/deleteQuiz/:id', authenticateToken, deleteQuiz);

export default router;
