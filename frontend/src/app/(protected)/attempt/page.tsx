/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { getQuizByInviteCode } from "~/lib/clientApis";
import { useRouter } from "next/navigation";


export default function QuizResults() {
  const [invitationLink, setInvitationLink] = useState("");
  const router = useRouter();

  const handleInviteJoin = async () => {
   const { quiz } = await getQuizByInviteCode(invitationLink);
   router.push(`/attempt-quiz/${invitationLink}`);
  };

  return (
    <div className="container mx-auto py-8">

      <div className={cn("grid gap-2")}>
        <Label htmlFor="invitation-link">Invitation Link</Label>
        <Input
          id="invitation-link"
          type="text"
          placeholder="Enter your invitation link"
          value={invitationLink}
          onChange={(e) => setInvitationLink(e.target.value)}
        />
        <Button onClick={handleInviteJoin}>
          Join
        </Button>
      </div>

    </div>
  );
}
