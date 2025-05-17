"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { useState } from "react";
import { FaEllipsisV, FaTrashAlt, FaCopy, FaLink } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { deleteProject } from "../action";

export default function ProjectActionsDropdown({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const handleDelete = async () => {
    const confirmed = confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteProject({ projectId });
      router.push("/projects");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting the project.");
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Project Actions"
        >
          <FaEllipsisV />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="z-50 w-64 rounded-md border border-gray-200 bg-white shadow-md"
      >
        <button
          onClick={() =>
            handleCopy(`${window.location.origin}/projects/${projectId}`)
          }
          className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-2 focus:outline-none focus:ring-0"
        >
          <FaLink className="text-gray-400" /> Copy Link
        </button>
        <button
          onClick={() => handleCopy(projectId)}
          className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-2 focus:outline-none focus:ring-0"
        >
          <FaCopy className="text-gray-400" /> Copy ID
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="w-full text-left px-4 py-3 text-sm text-red-600 flex items-center gap-2 hover:bg-gray-100 disabled:opacity-50 focus:outline-none focus:ring-0"
        >
          <FaTrashAlt className="text-red-400" />
          {loading ? "Deleting..." : "Delete"}
        </button>
      </PopoverContent>
    </Popover>
  );
}