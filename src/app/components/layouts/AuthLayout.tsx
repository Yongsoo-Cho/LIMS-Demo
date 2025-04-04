"use client";

import { useAuthGuard } from "@/app/hooks/useAuthGuard";
import Navbar from "../ui/Navbar";
import Loading from "../ui/Loading";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isChecking } = useAuthGuard();
  if (isChecking) return <Loading />;

  return (
    <div className="flex min-h-screen w-screen">
      <Navbar />
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
