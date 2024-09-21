import { Router } from 'express';
import { getAllQuizzes, getQuizById, createQuiz, updateQuizTitle, deleteQuiz, addQuestionToQuiz } from '../controllers/quizController';

const router = Router();

router.get('/getAllQuizzes', getAllQuizzes);
router.get('/getQuiz/:id', getQuizById);

router.put('/updateQuizTitle/:id', updateQuizTitle);
router.post('/addQuestionToQuiz/:quizId', addQuestionToQuiz);

router.post('/createQuiz', createQuiz);
router.delete('/deleteQuiz/:id', deleteQuiz);

export default router;
