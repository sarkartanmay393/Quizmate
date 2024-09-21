import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import resultRoutes from './routes/resultRoutes';
import quizRoutes from './routes/quizRoutes';
import questionRoutes from './routes/questionRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (_, res) => {
  res.send('Welcome to the QuizMate API!');
})

app.use('/api', userRoutes);
app.use('/api', resultRoutes);
app.use('/api', questionRoutes);
app.use('/api', quizRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});