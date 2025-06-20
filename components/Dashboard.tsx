"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

const Dashboard = ({ callbackUrl }: { callbackUrl: string }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, router]);

  return <div className="bg-card p-4">Dashboard</div>;
};

export default Dashboard;
