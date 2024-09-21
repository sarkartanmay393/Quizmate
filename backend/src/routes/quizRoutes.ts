import { Router } from 'express';
import { getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz } from '../controllers/QuizController';

const router = Router();

router.get('/quizzes', getAllQuizzes);
router.get('/quizzes/:id', getQuizById);
router.post('/quizzes', createQuiz);
router.put('/quizzes/:id', updateQuiz);
router.delete('/quizzes/:id', deleteQuiz);

export default router;
