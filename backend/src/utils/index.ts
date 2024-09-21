export interface UserSelectedAnswers {
  [questionId: number]: {
    answerId: number;
    timeTaken: number;
    correntAnswerId?: number;
  };
}

export interface QuizAttemptReport {
  quizId: number;
  userSelectedAnswers: UserSelectedAnswers;
}

export interface QuestionsWithAnswers {
  id: number;
  text: string;
  answers: Answer[];
}

export interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
}

export const checkScoreAndTimeTaken = (userSelectedAnswers: UserSelectedAnswers, questionsWithAnswers: QuestionsWithAnswers[]) => {
  const correctFactor = 100 / questionsWithAnswers.length;
  let score = 0;
  let timeTaken = 0;
  for (const questionId in userSelectedAnswers) {
    const answerId = userSelectedAnswers[questionId].answerId;

    const question = questionsWithAnswers.find((qna) => qna.id === Number(questionId));
    if (!question) {
      throw new Error(`Question ${questionId} not found`);
    }

    const correntAnswer = question.answers.find((ans) => ans.isCorrect);
    if (!correntAnswer) {
      throw new Error(`Answer for question ${questionId} not found`);
    }

    if (answerId === correntAnswer.id) {
      score += correctFactor;
    }
    timeTaken += userSelectedAnswers[questionId].timeTaken;
    userSelectedAnswers[questionId].correntAnswerId = answerId;
  }

  return { score: Number(score.toFixed(0)), timeTaken, detailedResults: userSelectedAnswers };
};