import axiosInstance from "./axiosInstance";
import type { Quiz, QuizAttemptReport } from "./types";

/* eslint-disable @typescript-eslint/no-unsafe-return */
export const getAllQuizzesByAdmin = async () => {
  const response = await axiosInstance.get('/getAllQuizzesByAdmin');
  return response.data;
};

export const createQuiz = async (quiz: Quiz) => {
  try {
    const response = await axiosInstance.post('/createQuiz', quiz);
    return response.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
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
  try {
    const response = await axiosInstance.post('/generateResult', {quizReport});
    return response.data;
  } catch (error) {
    console.error("Error generating result:", error);
    throw error;
  }
}

export const getAllResultsByQuizId = async () => {
  const response = await axiosInstance.get(`/getAllResultsForUser`);
  return response.data;
};

export const getAllResultsByQuizIdOriginal = async (id: number) => {
  const response = await axiosInstance.get(`/getAllResultsByQuizId/${id}`);
  return response.data;
};

export const getUserNameById = async (ids: number[]) => {
  const response = await axiosInstance.post(`/getUserNameById`, {ids: ids});
  return response.data;
}

export const deleteQuiz = async (id: number) => {
  try {
    const response = await axiosInstance.delete(`/deleteQuiz/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
}