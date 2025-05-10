import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton() {
  return (
    <form action="/auth/signout" method="post">
      <button
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-sm font-medium bg-transparent transition hover:bg-gray-800 text-white`}
      >
        <FaSignOutAlt /> Logout
      </button>
    </form>
  );
}
