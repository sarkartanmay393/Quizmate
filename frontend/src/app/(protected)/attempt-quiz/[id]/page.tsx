/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "~/components/ui/card"
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { CheckCircle } from 'lucide-react'
import { generateResult, getQuizByInviteCode } from '~/lib/clientApis'
import type { Quiz, QuizAttemptReport, QuizQuestion, UserSelectedAnswers } from '~/lib/types'
import { Button } from '~/components/ui/button'
import { useRouter } from 'next/navigation'
import { Progress } from '~/components/ui/progress'
import { toast } from '~/hooks/use-toast'


export default function CandidateDetailPage({ params }: { params: { id: string } }) {
  // const [candidate] = useState<Candidate>(mockCandidate)
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(60)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userAnswers, setUserAnswers] = useState<UserSelectedAnswers>({})
  const [quizStartTime, setQuizStartTime] = useState(Date.now())
  const [quizReport, setQuizReport] = useState<QuizAttemptReport | null>(null)
  const [score, setScore] = useState(-1)
  const router = useRouter()

  // const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleNextQuestion()
    }
  }, [timeLeft, quizCompleted])

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const currentQuestion = questions[currentQuestionIndex]
      const timeTaken = 60 - timeLeft
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestion?.id ?? '']: {
          answerId: selectedAnswer,
          timeTaken,
          correctAnswerId: currentQuestion?.correctAnswerId
        }
      }))
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setTimeLeft(60)
      setQuizStartTime(Date.now())
    } else {
      handleFinishQuiz()
    }
  }

  const handleFinishQuiz = () => {
    const report = {
      quizId: quiz?.id ?? 0,
      userSelectedAnswers: userAnswers
    }
    setQuizReport(report)
    console.log("Quiz Attempt Report:", report)
    generateResult(report).then(res => {
      console.log("Result:", res);
      router.push(`/result/${res.newResult.id}`)
    }).catch(() => {
      toast({
        title: "Error generating result",
        description: "Please try again later.",
      });
    });

  }

  const currentQuestion = questions[currentQuestionIndex]

  // const formatTime = (seconds: number) => {
  //   const minutes = Math.floor(seconds / 60)
  //   const remainingSeconds = seconds % 60
  //   return `${minutes}m ${remainingSeconds}s`
  // }

  // const copyEmail = async () => {
  //   try {
  //     await navigator.clipboard.writeText(candidate.email)
  //     setCopied(true)
  //     setTimeout(() => setCopied(false), 2000)
  //   } catch (err) {
  //     console.error('Failed to copy email: ', err)
  //   }
  // }

  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const getQuiz = async () => {
      const { quiz: quizData } = await getQuizByInviteCode(params.id as string);
      setQuiz(quizData as Quiz);
      setQuestions((quizData as Quiz).questions.map((q) => ({
        ...q,
        correctAnswerId: q.answers.find((a) => a.isCorrect)?.id,
      })));
    };
    void getQuiz();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="mx-auto max-w-4xl">
        <Card className="w-full max-w-3xl mx-auto mt-8">
          <CardHeader>
            <CustomProgress max={60} value={timeLeft} />
            <CardTitle>{quiz?.title}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="text-sm font-semibold">Time left: {timeLeft} seconds</div>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">{currentQuestion?.text}</h2>
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => setSelectedAnswer(parseInt(value))}
              className="space-y-2"
            >
              {currentQuestion?.answers.map((answer) => (
                <div key={answer.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={answer?.id?.toString() ?? ''} id={`answer-${answer.id}`} />
                  <Label htmlFor={`answer-${answer.id}`}>{answer.text}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button
              onClick={handleNextQuestion}
              className="mt-6"
              disabled={selectedAnswer === null}
            >
              {currentQuestionIndex === questions?.length - 1 ? "Finish" : "Next"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const CustomProgress = ({ max, value }: any) => {
  const percentage = (value / max) * 100;

  return (
    <div className="relative w-full h-1 bg-gray-200 rounded mb-3">
      <div
        className="absolute top-0 left-0 h-1 bg-blue-600 rounded"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};