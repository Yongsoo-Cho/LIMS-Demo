"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaBoxOpen,
  FaProjectDiagram,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../config/supabaseClient";
import UserInfoCard from "./UserInfoCard";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <FaTachometerAlt className="mr-3" />,
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: <FaCalendarAlt className="mr-3" />,
    },
    {
      name: "Supplies",
      href: "/supplies",
      icon: <FaBoxOpen className="mr-3" />,
    },
    {
      name: "Projects",
      href: "/projects",
      icon: <FaProjectDiagram className="mr-3" />,
    },
    {
      name: "Team Members",
      href: "/profiles", // 👈 This is the new route
      icon: <FaUsers className="mr-3" />,
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="h-screen w-64 border-r border-gray-200 flex flex-col p-2">
      <div className="flex flex-col gap-4 px-6 pt-8">
        <UserInfoCard user={user} />
        <nav className="mt-6 flex flex-col gap-2">
          {navItems.map(({ name, href, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={name}
                href={href}
                className={`flex items-center transition-colors font-medium px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {icon}
                {name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-6 mt-auto">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-sm font-medium transition ${
            pathname === "/login"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </aside>
  );
}
