import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex gap-2 min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h3>Welcome to Quizmate!</h3>
      <Button asChild variant='outline'>
        <Link href="/auth" className="text-black">Enter into Auth</Link>
      </Button>
    </main>
  );
}
