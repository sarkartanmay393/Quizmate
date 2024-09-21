"use client"; // This tells Next.js to treat this as a client component

import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ChevronDown, Edit, Eye, LogOut, Plus } from "lucide-react";

// Mock data for quizzes
const mockQuizzes = [
  { id: 1, name: "General Knowledge Quiz" },
  { id: 2, name: "Science Trivia" },
  { id: 3, name: "History Challenge" },
];

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState(mockQuizzes);

  // Mock admin data
  const admin = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://github.com/shadcn.png", // Using a placeholder avatar
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">QuizMate</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={admin.avatarUrl} alt={admin.name} />
                  <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{admin.name}</DropdownMenuLabel>
              <DropdownMenuItem>{admin.email}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Quizzes
            </h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> CREATE QUIZ
            </Button>
          </div>

          {quizzes.length === 0 ? (
            <div className="py-12 text-center">
              <p className="mb-4 text-gray-500">
                You haven&apos;t created any quizzes yet.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> CREATE QUIZ
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <li
                  key={quiz.id}
                  className="flex items-center justify-between py-4"
                >
                  <span className="text-lg font-medium text-gray-900">
                    {quiz.name}
                  </span>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
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
