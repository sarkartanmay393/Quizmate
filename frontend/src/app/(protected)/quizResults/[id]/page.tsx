/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Button } from "~/components/ui/button"
// import { Pagination } from "~/components/ui/pagination"
import { Skeleton } from "~/components/ui/skeleton"
import { getAllResultsByQuizIdOriginal, getUserNameById } from "~/lib/clientApis"

interface Result {
  id: number
  score: number
  timeTaken: number
  detailed: {
    [questionId: string]: {
      selectedAnswer: number
      isCorrect: boolean
      timeTaken: number
    }
  }
  userId: number
  quizId: number
}

interface QuizResultsProps {params:{
  id: number
}}

export default function QuizResults({ params: { id} }: QuizResultsProps) {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 10
  const router = useRouter()

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await getAllResultsByQuizIdOriginal(id);
        const data = response.results;
        setResults(data)
      } catch (err) {
        setError('An error occurred while fetching the results.')
      } finally {
        setLoading(false)
      }
    }

    void fetchResults()
  }, [id])

  const [users, setUsers] = useState<{id: number, name: string}[]>([])
  useEffect(() => {
    if (results.length === 0) {
      return;
    }
    const fetchResults = async (ids: number[]) => {
      try {
        const response = await getUserNameById(ids) as {users: {id: number, name: string}[]}
        const data = response.users;
        return data;
      } catch (err) {
        setError('An error occurred while fetching the results.')
        return [];
      }
    }
    
    const ids = results.map((result) => result.userId);
    fetchResults(ids).then((users) => {
      console.log("Users:", users);
      setUsers(users);
    });
  }, [results])

  // const totalPages = Math.ceil(results.length / resultsPerPage)
  // const paginatedResults = results.slice(
  //   (currentPage - 1) * resultsPerPage,
  //   currentPage * resultsPerPage
  // )

  const averageScore = results.length > 0
    ? results.reduce((sum, result) => sum + result.score, 0) / results.length
    : 0

  const averageTimeTaken = results.length > 0
    ? results.reduce((sum, result) => sum + result.timeTaken, 0) / results.length
    : 0

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-8 mb-4" />
          <Skeleton className="w-full h-64" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <p>Total Attempts: {results.length}</p>
          <p>Average Score: {averageScore.toFixed(2)}</p>
          <p>Average Time Taken: {averageTimeTaken} seconds</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Time Taken</TableHead>
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id}>
                <TableCell>{users.find((user) => user.id === result.userId)?.name}</TableCell>
                <TableCell>{result.score}</TableCell>
                <TableCell>{result.timeTaken} seconds</TableCell>
                {/* <TableCell>
                  <Button
                    onClick={() => router.push(`/results/${result.id}`)}
                    variant="outline"
                    size="sm"
                  >
                    View Details
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* {totalPages > 1 && (
          <Pagination className="mt-4">
            <Button
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="mx-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </Pagination>
        )} */}
      </CardContent>
    </Card>
  )
}