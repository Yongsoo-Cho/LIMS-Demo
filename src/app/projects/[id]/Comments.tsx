"use client";

import { useEffect, useState } from "react";
import { fetchComments, postComment } from "../action";
import Image from "next/image";

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
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    const data = await fetchComments(projectId);
    setComments(
      data.map((comment) => ({
        ...comment,
        body: comment.body ?? "",
        mentions: comment.mentions ?? [],
        project_id: comment.project_id ?? "",
        user_id: comment.user_id ?? "",
      }))
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
            <div>
              <p className="font-medium text-gray-900 mb-0.5">
                {c.profiles?.display_name || "Unknown User"}
              </p>
              <p>{c.body}</p>
              <p className="text-xs text-gray-400 mt-1">
                Posted on {new Date(c.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <textarea
          placeholder="Add a comment..."
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full resize-none text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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