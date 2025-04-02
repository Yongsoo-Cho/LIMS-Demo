"use client";

import { supabase } from "../../config/supabaseClient";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-sm font-semibold text-gray-700 rounded-lg border border-gray-300 transition duration-200 shadow-sm"
    >
      Logout
    </button>
  );
}
