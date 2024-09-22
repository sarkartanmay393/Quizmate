'use client';

import { useEffect } from "react";
import { type User } from "~/lib/types";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const route = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') ?? "{}") as User;
    if (!user) {
      route.push('/auth');
    }
    if (user?.role !== 'admin') {
      route.push('/attempt');
    } else {
      route.push('/dashboard/admin');
    }
  }, []);

  return children;
}