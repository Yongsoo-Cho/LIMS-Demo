"use client";

import { useEffect, useRef, useState } from "react";
import { FaEllipsisV, FaTrashAlt, FaCopy, FaLink } from "react-icons/fa";
import { deleteProject } from "../action";
import { useRouter } from "next/navigation";

export default function ProjectActionsDropdown({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
    setOpen(false);
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this project? This action cannot be undone.");
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteProject({projectId})
      router.push("/projects");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting the project.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Project Actions"
      >
        <FaEllipsisV />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-black rounded-md z-20">
          <button
            onClick={() => handleCopy(`${window.location.origin}/projects/${projectId}`)}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <FaLink className="text-gray-400" /> Copy Link
          </button>
          <button
            onClick={() => handleCopy(projectId)}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <FaCopy className="text-gray-400" /> Copy ID
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full text-left px-4 py-3 text-sm text-red-600 flex items-center gap-2 hover:bg-gray-100"
          >
            <FaTrashAlt className="text-red-400" /> {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}