/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getAllResultsByQuizId } from "~/lib/clientApis";

export default function ResultPage({ params }: { params: { id: string } }) {
  const [score, setScore] = useState(0)

  useEffect(() => {
    const getResults = async () => {
      const data = await getAllResultsByQuizId();
      setScore((data.results ?? []).find((r: { id: number; }) => r.id === Number(params.id))?.score ?? 0);
    };
    void getResults();
  }, []);

    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Quiz Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Thank you for completing the quiz! Your score is {score}</p>
        </CardContent>
      </Card>
    )
}