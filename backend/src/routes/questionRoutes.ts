import { Router } from 'express';
import { getAllQuestionsForQuiz, getQuestionById, createQuestionForQuiz, updateQuestion, deleteQuestion } from '../controllers/QuestionController';

const router = Router();

router.get('/quizzes/:quizId/questions', getAllQuestionsForQuiz); // Get all questions for a specific quiz
router.get('/questions/:id', getQuestionById); // Get a specific question by ID
router.post('/quizzes/:quizId/questions', createQuestionForQuiz); // Create a new question for a quiz
router.put('/questions/:id', updateQuestion); // Update a question by ID
router.delete('/questions/:id', deleteQuestion); // Delete a question by ID

export default router;
