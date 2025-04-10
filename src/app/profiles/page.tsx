"use client";

import AuthLayout from "@/app/components/layouts/AuthLayout";
import Image from "next/image";
import { useCachedFetch } from "@/app/hooks/useCachedFetch";
import { fetchTeamProfiles } from "./action";
import type { MinimalProfile } from "./action";

export default function TeamPage() {
  const {
    data: profiles,
    loading,
    error,
  } = useCachedFetch<MinimalProfile[]>("cached_profiles", fetchTeamProfiles);

  return (
    <AuthLayout>
      <main className="p-8 w-full">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Team Members
        </h1>

        {loading ? (
          <ul className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex items-center px-4 py-3 gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200" />
                <div className="flex flex-col gap-1 w-full">
                  <div className="w-1/3 h-3 bg-gray-200 rounded" />
                  <div className="w-1/5 h-2 bg-gray-100 rounded" />
                </div>
              </li>
            ))}
          </ul>
        ) : error ? (
          <p className="text-red-500">Failed to load profiles.</p>
        ) : (
          <ul className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
            {profiles?.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={user.avatar_url || "/default-avatar.png"}
                    alt={`${user.display_name}'s avatar`}
                    width={32}
                    height={32}
                    className="rounded-full border border-gray-200 object-cover"
                  />
                  <div className="flex flex-col text-sm leading-tight">
                    <span className="font-medium text-gray-900">
                      {user.display_name}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </AuthLayout>
  );
}
