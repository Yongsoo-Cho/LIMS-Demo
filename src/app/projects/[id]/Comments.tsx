"use client";

import { useEffect, useState } from "react";
import {
  fetchComments,
  postComment,
  updateComment,
  deleteComment,
} from "../action";
import Image from "next/image";
import { useAuth } from "@/app/context/AuthProvider";
import * as Popover from "@radix-ui/react-popover";
import { FaEllipsisV, FaPen, FaTrash } from "react-icons/fa";

type Comment = {
  id: number;
  body: string;
  created_at: string;
  user_id: string;
  mentions: string[];
  project_id: string;
  profiles?: {
    display_name: string;
    avatar_url: string;
  };
};

export default function Comments({ projectId }: { projectId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingBody, setEditingBody] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadComments = async () => {
    const data = await fetchComments(projectId);
    setComments(
      data.map((comment) => ({
        ...comment,
        body: comment.body ?? "",
        mentions: comment.mentions ?? [],
        project_id: comment.project_id ?? "",
        user_id: comment.user_id ?? "",
      })),
    );
  };

  useEffect(() => {
    loadComments();
  }, [projectId]);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    await postComment({ body: newComment, project_id: projectId });
    setNewComment("");
    await loadComments();
    setLoading(false);
  };

  const handleEdit = async (id: number) => {
    if (!editingBody.trim()) return;
  
    try {
      await updateComment({ id, body: editingBody });
    } catch (err) {
      console.error("Failed to update comment:", err);
      alert("Something went wrong while updating the comment.");
    } finally {
      setEditingId(null);
      setEditingBody("");
      await loadComments();
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
  
    try {
      await deleteComment({ id });
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert("Something went wrong while deleting the comment.");
    } finally {
      await loadComments();
    }
  };

  return (
    <section className="pt-6 border-t border-gray-200">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">Comments</h2>

      <div className="max-h-64 overflow-y-auto space-y-3 mb-4 pr-1">
        {comments.map((c) => (
          <div
            key={c.id}
            className="border border-gray-100 rounded-md p-3 bg-gray-50 text-sm text-gray-800 flex gap-3 items-start"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border border-gray-300">
              <Image
                src={c.profiles?.avatar_url || "/default-avatar.png"}
                alt={c.profiles?.display_name || "User"}
                width={36}
                height={36}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 mb-0.5">
                {c.profiles?.display_name || "Unknown User"}
              </p>
              {editingId === c.id ? (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-0"
                    value={editingBody}
                    onChange={(e) => setEditingBody(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                      onClick={() => {
                        setEditingId(null);
                        setEditingBody("");
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      onClick={() => handleEdit(c.id)}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p>{c.body}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Posted on {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
            {user?.id === c.user_id && editingId !== c.id && (
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button
                    className="p-1 text-gray-500 hover:text-gray-700 transition"
                    aria-label="More actions"
                  >
                    <FaEllipsisV />
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    className="z-50 bg-white border border-gray-200 rounded-md shadow-lg p-2 space-y-1 w-28"
                    sideOffset={8}
                    align="end"
                    side="bottom"
                  >
                    <button
                      onClick={() => {
                        setEditingId(c.id);
                        setEditingBody(c.body);
                      }}
                      className="flex items-center gap-2 w-full text-sm px-2 py-1 text-gray-700 hover:bg-gray-100 rounded focus:outline-none focus:ring-0"
                    >
                      <FaPen className="text-xs" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="flex items-center gap-2 w-full text-sm px-2 py-1 text-red-600 hover:bg-gray-100 rounded focus:outline-none focus:ring-0"
                    >
                      <FaTrash className="text-xs" />
                      Delete
                    </button>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            )}
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <textarea
          placeholder="Add a comment..."
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full resize-none text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handlePost}
            disabled={loading || !newComment.trim()}
            className={`text-sm px-4 py-2 rounded-md text-white transition ${
              loading || !newComment.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>
    </section>
  );
}
