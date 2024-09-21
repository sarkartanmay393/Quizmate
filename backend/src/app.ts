import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import resultRoutes from './routes/resultRoutes';
import quizRoutes from './routes/quizRoutes';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.get('/', (_, res) => {
  res.send('Welcome to the QuizMate API!');
})

app.use('/v1/api', userRoutes);
app.use('/v1/api', quizRoutes);
app.use('/v1/api', resultRoutes);

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