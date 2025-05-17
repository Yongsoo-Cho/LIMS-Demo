"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { fetchProfiles, updateProjectAssignees } from "../action";

export default function AssigneesCard({
  assigneeIds,
  profiles,
  projectId,
}: {
  assigneeIds: string[];
  profiles: Record<
    string,
    { display_name: string | null; avatar_url: string | null }
  >;
  projectId: string;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [allProfiles, setAllProfiles] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>(assigneeIds);
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = async () => {
    setShowDropdown((prev) => !prev);
    if (Object.keys(allProfiles).length === 0) {
      const fetched = await fetchProfiles();
      setAllProfiles(fetched);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  const handleSelect = async (id: string) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((sid) => sid !== id)
      : [...selectedIds, id];

    setSelectedIds(updated);
    setSaving(true);
    try {
      await updateProjectAssignees({ projectId, assignees: updated });
    } catch (error) {
      console.error("Failed to update assignees:", error);
      alert("Something went wrong while updating assignees.");
      setSelectedIds(selectedIds);
    } finally {
      setSaving(false);
    }
  };

  const sortedProfiles = Object.entries(allProfiles).sort(([idA], [idB]) => {
    const isASelected = selectedIds.includes(idA) ? -1 : 1;
    const isBSelected = selectedIds.includes(idB) ? -1 : 1;
    return isASelected - isBSelected;
  });

  return (
    <div className="bg-gray-100 p-4 rounded relative" ref={dropdownRef}>
      <h3 className="text-sm font-medium text-gray-600 mb-1">Assignees</h3>
      <button
        onClick={toggleDropdown}
        disabled={saving}
        className="flex -space-x-2 overflow-hidden bg-transparent hover:bg-gray-200 p-1 rounded-sm transition-colors duration-100 ease-in-out"
      >
        {selectedIds.map((id) => {
          const profile = profiles[id];
          return (
            <Avatar key={id} className="w-8 h-8 border-2 border-white">
              <AvatarImage src={profile?.avatar_url || ""} />
              <AvatarFallback>
                {profile?.display_name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          );
        })}
      </button>

      {showDropdown && (
        <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow-lg w-60 max-h-60 overflow-y-auto">
          {sortedProfiles.map(([id, displayName]) => {
            const isSelected = selectedIds.includes(id);
            return (
              <div
                key={id}
                onClick={() => handleSelect(id)}
                className={`px-3 py-2 text-sm cursor-pointer transition ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {displayName || "Unnamed"}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
