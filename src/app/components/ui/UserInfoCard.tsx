"use client";

import { FaUserCircle } from "react-icons/fa";
import { User } from "@supabase/supabase-js";

interface UserInfoCardProps {
  user: User | null;
}

export default function UserInfoCard({ user }: UserInfoCardProps) {
  const displayName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const avatarUrl = user?.user_metadata?.avatar_url;

  const inferredProvider = (() => {
    if (user?.app_metadata?.provider === "slack") return "Slack";
    if (user?.user_metadata?.iss?.includes("slack.com")) return "Slack";
    if (user?.app_metadata?.provider === "google") return "Google";
    if (user?.app_metadata?.provider === "email") return "Email";
    if (user?.app_metadata?.provider === "discord") return "Discord";
    return null;
  })();

  return (
    <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="User avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <FaUserCircle className="text-blue-500 text-lg" />
      )}
      <div className="flex flex-col truncate">
        <span className="text-sm font-medium text-gray-800 truncate">
          {displayName}
        </span>
        {user?.email && (
          <span className="text-xs text-gray-500 truncate">{user.email}</span>
        )}
        {inferredProvider && (
          <span className="text-xs text-blue-400">via {inferredProvider}</span>
        )}
      </div>
    </div>
  );
}
