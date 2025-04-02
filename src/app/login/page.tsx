"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import AuthForm from "../components/ui/AuthForm";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading || user) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <AuthForm />
    </div>
  );
}
