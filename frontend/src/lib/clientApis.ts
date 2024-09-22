import axiosInstance from "./axiosInstance";
import type { Quiz, QuizAttemptReport } from "./types";

/* eslint-disable @typescript-eslint/no-unsafe-return */
export const getAllQuizzesByAdmin = async () => {
  const response = await axiosInstance.get('/getAllQuizzesByAdmin');
  return response.data;
};

export const createQuiz = async (quiz: Quiz) => {
  const response = await axiosInstance.post('/createQuiz', quiz);
  return response.data;
};

export const getQuizById = async (id: number) => {
  const response = await axiosInstance.get(`/getQuizById/${id}`);
  return response.data;
};

export const getQuizByInviteCode = async (inviteCode: string) => {
  const response = await axiosInstance.get(`/getQuizByInviteCode/${inviteCode}`);
  return response.data;
};

export const generateResult = async (quizReport: QuizAttemptReport) => {
  const response = await axiosInstance.post('/generateResult', {quizReport});
  return response.data;
}

export const getAllResultsByQuizId = async () => {
  const response = await axiosInstance.get(`/getAllResultsForUser`);
  return response.data;
};