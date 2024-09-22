"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Candidate {
  id: number;
  name: string;
  score: number;
  timeTaken: number;
}

const candidates: Candidate[] = [
  { id: 1, name: "John Doe", score: 8, timeTaken: 540 },
  { id: 2, name: "Jane Smith", score: 9, timeTaken: 480 },
  { id: 3, name: "Bob Johnson", score: 7, timeTaken: 600 },
  { id: 4, name: "Alice Brown", score: 10, timeTaken: 510 },
  { id: 5, name: "Charlie Davis", score: 6, timeTaken: 570 },
];

export default function QuizResults() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            General Knowledge Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Time Taken</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">
                    {candidate.name}
                  </TableCell>
                  <TableCell>{candidate.score} / 10</TableCell>
                  <TableCell>{formatTime(candidate.timeTaken)}</TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Candidate Details</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Name:</span>
                            <span className="col-span-3">
                              {selectedCandidate?.name}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Score:</span>
                            <span className="col-span-3">
                              {selectedCandidate?.score} / 10
                            </span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-bold">Time Taken:</span>
                            <span className="col-span-3">
                              {formatTime(selectedCandidate?.timeTaken || 0)}
                            </span>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
