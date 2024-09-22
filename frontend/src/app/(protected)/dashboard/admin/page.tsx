/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Edit, Eye, Plus } from "lucide-react";
import { getAllQuizzesByAdmin } from "~/lib/clientApis";
import { useRouter } from "next/navigation";
import type { Quiz } from "~/lib/types";

const mockQuizzes = [
  { id: 1, name: "General Knowledge Quiz" },
  { id: 2, name: "Science Trivia" },
  { id: 3, name: "History Challenge" },
];

export default function Dashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const router = useRouter();

  useEffect(() => {
    void getAllQuizzesByAdmin().then(({ quizzes }) => {
      console.log("Quizzes:", quizzes);
      setQuizzes(quizzes as Quiz[]);
    });
  }, []);

  const handleCreateQuiz = async () => {
    router.push('/create-quiz');
  };

  const handleEditQuiz = (quiz: Quiz) => {
    const qesutions = quiz.questions.map((q) => ({
      text: q.text,
      category: q.category,
      answers: q.answers.map((a) => ({ text: a.text, isCorrect: q.correctAnswerId === a.id })),
      correctAnswerId: q.answers.find((a) => a.isCorrect)?.id,
    }));

    localStorage.setItem("quiz", JSON.stringify({
      title: quiz.title,
      questions: qesutions,
    }));
    router.push(`/edit-quiz/${quiz.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Quizzes
            </h2>
            {quizzes.length > 0 && <Button onClick={handleCreateQuiz}>
              <Plus className="mr-2 h-4 w-4" /> CREATE QUIZ
            </Button>}
          </div>

          {quizzes.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-4 text-gray-500">
                You haven&apos;t created any quizzes yet.
              </p>
              <Button onClick={handleCreateQuiz}>
                <Plus className="mr-2 h-4 w-4" /> CREATE QUIZ
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {quizzes.map((quiz, optionIndex) => (
                <li
                  key={quiz?.id ?? optionIndex}
                  className="flex items-center justify-between py-4"
                >
                  <span className="text-lg font-medium text-gray-900">
                    {quiz?.title}
                  </span>
                  <div className="space-x-2">
                    {/* <Button variant="outline" size="sm" onClick={() => handleEditQuiz(quiz)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button> */}
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" /> View Results
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
