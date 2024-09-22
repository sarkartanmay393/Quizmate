/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
} | null;

export type Quiz = {
  id?: number;
  title: string;
  inviteCode?: string;
  results?: unknown[];
  questions: QuizQuestion[];
};

export type QuizResult = {
  id?: number;
  quizId: number;
  userId: number;
  score: number;
};

export type QuizAnswer = {
  id?: number;
  text: string;
  isCorrect: boolean;
}

export type QuizQuestion = {
  id?: number;
  text: string;
  category: string;
  answers: QuizAnswer[];
  correctAnswerId?: number;
};


export type UserSelectedAnswers = {
  [questionId: number]: {
    answerId: number;
    timeTaken: number;
    correctAnswerId?: number;
  };
}

export interface QuizAttemptReport {
  quizId: number;
  userSelectedAnswers: UserSelectedAnswers;
}