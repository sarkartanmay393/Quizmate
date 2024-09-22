"use client";

import { useState } from "react";
import { LoginForm, SignUpForm } from "~/components/AuthComponents";
import {
  Card,
  CardContent,
  // CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { useRouter } from 'next/navigation';


export default function AdminAuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const success = () => {
    router.push('/dashboard');
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Authentication
          </CardTitle>
          {/* <CardDescription className="text-center">
            {activeTab === 'login' ? "Login" : "Create a new admin account"}
          </CardDescription> */}
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm success={success} />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm success={success} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className={cn("flex justify-center", activeTab === "signup" && "hidden")}>
          <p className="text-sm text-gray-500">
            Protected area. Authorized personnel only.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
