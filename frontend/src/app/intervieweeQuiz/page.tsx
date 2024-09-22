"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "~/components/ui/card";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Progress } from "~/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    text: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    id: 3,
    text: "Who painted the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Leonardo da Vinci",
      "Pablo Picasso",
      "Claude Monet",
    ],
    correctAnswer: "Leonardo da Vinci",
  },
  {
    id: 4,
    text: "What is the largest mammal?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    correctAnswer: "Blue Whale",
  },
];

export default function Component() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [progress, setProgress] = useState(0);
  const [quizName] = useState("General Knowledge Quiz");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const shuffledQuestions = shuffleArray(sampleQuestions);
    setQuestions(shuffledQuestions);
    setSelectedAnswers(new Array(shuffledQuestions.length).fill(null));
  }, []);

  useEffect(() => {
    if (quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          handleNextQuestion();
          return 60;
        }
        return prevTime - 1;
      });
      setProgress((prevProgress) => prevProgress + 100 / 60);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, quizCompleted]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setTimeLeft(60);
      setProgress(0);
    }
  }, [currentQuestionIndex, questions.length]);

  const handleAnswerSelection = (selectedAnswer: string) => {
    setSelectedAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = selectedAnswer;
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setQuizCompleted(true);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <Card className="mx-auto w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Quiz Completed!</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTitle>Your Score</AlertTitle>
                <AlertDescription>
                  You scored {score} out of {questions.length} questions
                  correctly.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 flex items-center justify-between rounded-lg bg-white p-4 shadow">
          <h1 className="text-2xl font-bold text-gray-800">{quizName}</h1>
          <div className="text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </header>

        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle>{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4" />
            <RadioGroup
              value={selectedAnswers[currentQuestionIndex] || ""}
              onValueChange={handleAnswerSelection}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="mb-4 flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-grow">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div>Time left: {timeLeft} seconds</div>
            {currentQuestionIndex < questions.length - 1 ? (
              <Button onClick={handleNextQuestion}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Submit</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
