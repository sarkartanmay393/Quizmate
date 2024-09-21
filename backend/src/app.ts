import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import userRoutes from '././routes/userRoutes';
import resultRoutes from './routes/resultRoutes';
import quizRoutes from './routes/quizRoutes';
import { PrismaClient } from '@prisma/client';
import { catchAllMiddleware } from './middlewares/catchAllMiddleware';
import { catchGlobalErrors } from './middlewares/catchGlobalErrors';

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: {
    message: 'Too many requests, please try again later.',
    status: 429,
  }
});

app.use(limiter);
app.use(express.json());
app.use(cors());

app.get('/', (_, res) => {
  res.send('Welcome to the QuizMate API!');
})

app.use('/v1/api', userRoutes);
app.use('/v1/api', quizRoutes);
app.use('/v1/api', resultRoutes);

app.use(catchAllMiddleware);
app.use(catchGlobalErrors);

app.listen(PORT, () => {
  checkDatabaseConnection(() => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});

async function checkDatabaseConnection(cb: any) {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    cb();
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
  }
}