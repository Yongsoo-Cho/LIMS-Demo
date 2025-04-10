import { FaSignOutAlt } from "react-icons/fa";

export default function LogoutButton() {
  return (
    <form action="/auth/signout" method="post">
      <button
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-sm font-medium transition bg-gray-100 hover:bg-gray-200 text-gray-800`}
      >
        <FaSignOutAlt /> Logout
      </button>
    </form>
  );
}
