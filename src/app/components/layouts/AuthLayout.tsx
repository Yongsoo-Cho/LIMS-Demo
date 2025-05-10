import Navbar from "../ui/Navbar";

import '../../globals.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-screen">
      <Navbar />
      <main className="fixed top-0 left-64 w-[calc(100vw-256px)] h-screen overflow-y-scroll scrollbar-hidden flex-1 p-8 bg-gray-50">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
