"use client";

import { useEffect, useRef, useState } from "react";
import { updateProjectDescription } from "../action";
import { debounce, DebouncedFunc } from "lodash";

export default function DescriptionCard({
  description,
  projectId,
}: {
  description: string;
  projectId: string;
}) {
  const [desc, setDesc] = useState(description);
  const [saving, setSaving] = useState(false);
  const saveRef = useRef<DebouncedFunc<(value: string) => void> | null>(null);

  useEffect(() => {
    saveRef.current = debounce(async (value: string) => {
      if (!value.trim()) return;
      setSaving(true);
      try {
        await updateProjectDescription({ projectId, description: value });
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }, 1000); //calls API after a full second of inactivty

    return () => {
      saveRef.current?.cancel();
    };
  }, [projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setDesc(newValue);
    saveRef.current?.(newValue);
  };

  return (
    <div className="bg-gray-100 p-4 rounded w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
      <textarea
        value={desc}
        onChange={handleChange}
        rows={4}
        className="w-full resize-none text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-0"
        placeholder="Add a description..."
      />
      {saving && <p className="text-xs text-gray-400 mt-1">Saving...</p>}
    </div>
  );
}
