import Navbar from "../ui/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-screen">
      <Navbar />
      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
