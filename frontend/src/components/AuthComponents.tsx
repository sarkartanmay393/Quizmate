'use client';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import axiosInstance from "~/lib/axiosInstance";
import { cn } from "~/lib/utils";
import { toast } from "~/hooks/use-toast";

const LoginForm = ({ success }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [invitationLink, setInvitationLink] = useState("");
  const [showInviteLink, setShowInviteLink] = useState(false);

  useEffect(() => {
    const inviteCode = localStorage.getItem('inviteCode');
    if (inviteCode) {
      setShowInviteLink(true);
      setInvitationLink(inviteCode);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
    } else {
      setError("");
      axiosInstance.post('/login', { email, password })
        .then(res => {
          const { user, token } = res.data as any;
          if (!token) {
            throw new Error('Failed to login');
          }
          console.log(user);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token as string);
        })
        .catch(err => {
          toast({
            title: 'Error',
            description: JSON.stringify(err),
            variant: 'destructive',
          })
          console.log(JSON.stringify(err));
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }).finally(() => {
          success();
        });
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={cn("grid gap-2", !showInviteLink && "hidden")}>
          <Label htmlFor="invitation-link">Invitation Link</Label>
          <Input
            id="invitation-link"
            type="text"
            placeholder="Enter your invitation link"
            value={invitationLink}
            onChange={(e) => setInvitationLink(e.target.value)}
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button type="submit">Login</Button>
      </div>
    </form>
  );
};

const SignUpForm = ({ success}: any) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all fields");
    } else {
      setError("");
      axiosInstance.post('/createUser', { name, email, password, role })
        .then(res => {
          const { newUser, token } = res.data;
          if (!newUser) {
            throw new Error('Failed to register');
          }
          localStorage.setItem('user', JSON.stringify(newUser));
          localStorage.setItem('token', token as string);
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }).finally(() => {
          success();
        });
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Role</Label>
          <RadioGroup
            defaultValue={role}
            onValueChange={(value) => setRole(value)}
            className="flex items-center"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="interviewee" value="interviewee" />
              <Label htmlFor="interviewee">Interviewee</Label>
            </div>
            <div className="flex justify-center items-center space-x-2">
              <RadioGroupItem id="admin" value="admin" />
              <Label htmlFor="admin">Admin</Label>
            </div>
          </RadioGroup>
        </div>
        {/* {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )} */}
        <Button type="submit" className="mt-2">Sign Up</Button>
      </div>
    </form >
  );
};

export { LoginForm, SignUpForm };