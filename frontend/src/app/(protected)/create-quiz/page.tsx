/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type { Quiz, QuizQuestion } from "~/lib/types";
import { createQuiz } from "~/lib/clientApis";
import { useRouter } from "next/navigation";
import { toast } from "~/hooks/use-toast";

export default function CreateQuiz() {
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      text: "",
      category: "",
      answers: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ],
      correctAnswerId: 1,
    },
  ]);
  
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const validateQuiz = () => {
    // Check if the title is filled
    if (!quizTitle.trim()) return false;

    // Check if each question and answer is filled
    for (const question of questions) {
      if (!question.text.trim() || !question.category.trim()) return false;
      for (const answer of question.answers) {
        if (!answer.text.trim()) return false;
      }
    }

    return true;
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: questions.length + 1,
      text: "",
      category: questions.length === 0 ? "" : questions[questions.length - 1]?.category ?? "",
      answers: [
        { id: 1, text: "", isCorrect: false },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ],
      correctAnswerId: 1,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = ({ field, value, id }: { field: string; value: string | number; id?: number }) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  const updateOption = ({ questionId, answerId, answerText }: { questionId?: number; answerId?: number; answerText: string }) => {
    const exactQuestion = questions.find((q) => q.id === questionId)!;
    exactQuestion.answers = exactQuestion.answers.map((a) => (a.id === answerId ? { ...a, text: answerText } : a));
    setQuestions(questions.map((q) => (q.id === questionId ? exactQuestion : q)));
  };

  const deleteQuestion = (id?: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSubmitQuiz = async () => {
    if (!validateQuiz()) {
      toast({
        title: "Invalid Quiz",
        description: "Please fill out all fields before submitting.",
      });
      return;
    }

    try {
      const formattedQuestions = questions.map((q) => ({
        text: q.text,
        category: q.category,
        answers: q.answers.map((a) => ({ text: a.text, isCorrect: q.correctAnswerId === a.id })),
      }));
      const quiz: Quiz = { title: quizTitle, questions: formattedQuestions };
      const { newQuiz } = await createQuiz(quiz);
      console.log("Quiz Submitted:", newQuiz);
      localStorage.removeItem("quiz");
      router.push(`/dashboard/admin`);
    } catch (error) {
      console.error("Error formatting quiz:", error);
      toast({
        title: "Error formatting quiz",
        description: "Please try again later.",
      });
    }
  };

  useEffect(() => {
    setIsSubmitDisabled(!validateQuiz());
  }, [quizTitle, questions]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const localStorageQuiz = localStorage.getItem("quiz");
      if (localStorageQuiz) {
        const quiz = JSON.parse(localStorageQuiz) as Quiz;
        if (quiz) {
          setQuizTitle(quiz.title);
          setQuestions(quiz.questions);
        }
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>
              <Input
                type="text"
                placeholder="Enter quiz title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="text-xl font-bold"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {questions.map((question, optionIndex) => (
              <Card key={question.id ?? optionIndex} className="mb-6">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="mr-4 flex-1">
                    <Textarea
                      placeholder="Enter your question here"
                      value={question.text}
                      onChange={(e) => updateQuestion({ id: question.id, field: "text", value: e.target.value })}
                      className="w-full"
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Category"
                    value={question.category}
                    onChange={(e) => updateQuestion({ id: question.id, field: "category", value: e.target.value })}
                    className="w-1/4"
                  />
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={question.correctAnswerId?.toString() ?? ''}
                    onValueChange={(e) => {
                      updateQuestion({ id: question.id, field: "correctAnswerId", value: parseInt(e) });
                    }}
                  >
                    {question.answers.map((answer, optionIndex) => (
                      <div key={optionIndex} className="mb-2 flex items-center space-x-2">
                        <RadioGroupItem value={answer.id?.toString() ?? ''} id={`q${question.id}o${optionIndex}`} />
                        <Label htmlFor={`q${question.id}o${optionIndex}`} className="flex-1">
                          <Input
                            type="text"
                            placeholder={`Option ${optionIndex + 1}`}
                            value={answer.text}
                            onChange={(e) => updateOption({ questionId: question.id, answerId: answer.id, answerText: e.target.value })}
                            className="w-full"
                          />
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button variant="destructive" onClick={() => deleteQuestion(question.id)}>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Question
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col justify-center space-y-4">
            <Button onClick={addQuestion} className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add New Question
            </Button>

            <Button onClick={handleSubmitQuiz} className="w-full bg-green-500" disabled={isSubmitDisabled}>
              Create Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
