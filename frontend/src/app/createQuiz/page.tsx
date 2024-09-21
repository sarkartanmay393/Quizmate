"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface Question {
  id: number;
  text: string;
  category: string;
  options: string[];
  correctAnswer: number;
}

export default function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "",
      category: "",
      options: ["", "", "", ""],
      correctAnswer: -1,
    },
  ]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: questions.length + 1,
      text: "",
      category: "",
      options: ["", "", "", ""],
      correctAnswer: -1,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (
    id: number,
    field: string,
    value: string | number,
  ) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  const updateOption = (
    questionId: number,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, index) =>
                index === optionIndex ? value : opt,
              ),
            }
          : q,
      ),
    );
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSubmitQuiz = () => {
    // Handle quiz submission logic here (e.g., save the quiz data, make an API call)
    console.log("Quiz Submitted:", { title: quizTitle, questions });
  };

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
                className="text-2xl font-bold"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {questions.map((question, index) => (
              <Card key={question.id} className="mb-6">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="mr-4 flex-1">
                    <Textarea
                      placeholder="Enter your question here"
                      value={question.text}
                      onChange={(e) =>
                        updateQuestion(question.id, "text", e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Category"
                    value={question.category}
                    onChange={(e) =>
                      updateQuestion(question.id, "category", e.target.value)
                    }
                    className="w-1/4"
                  />
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={question.correctAnswer.toString()}
                    onValueChange={(value) =>
                      updateQuestion(
                        question.id,
                        "correctAnswer",
                        parseInt(value),
                      )
                    }
                  >
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="mb-2 flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={optionIndex.toString()}
                          id={`q${question.id}o${optionIndex}`}
                        />
                        <Label
                          htmlFor={`q${question.id}o${optionIndex}`}
                          className="flex-1"
                        >
                          <Input
                            type="text"
                            placeholder={`Option ${optionIndex + 1}`}
                            value={option}
                            onChange={(e) =>
                              updateOption(
                                question.id,
                                optionIndex,
                                e.target.value,
                              )
                            }
                            className="w-full"
                          />
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button
                    variant="destructive"
                    onClick={() => deleteQuestion(question.id)}
                  >
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

            {/* Submit Button */}
            <Button onClick={handleSubmitQuiz} className="w-full bg-green-500">
              Create Quiz
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
