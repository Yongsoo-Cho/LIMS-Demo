"use client";

import AuthLayout from "@/app/components/layouts/AuthLayout";
import Image from "next/image";
import { useCachedFetch } from "@/app/hooks/useCachedFetch";
import { fetchTeamProfiles } from "./action";
import type { ProfileInfo } from "./action";

export default function TeamPage() {
  const {
    data: profiles,
    loading,
    error,
  } = useCachedFetch<ProfileInfo[]>("cached_profiles", fetchTeamProfiles);

  return (
    <AuthLayout>
      <main className="p-8 w-full">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Team Members
        </h1>

        <div className="overflow-x-auto border border-gray-200">
          <table className="min-w-full bg-white text-sm text-left text-gray-700">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th scope="col" className="px-6 py-3 font-medium">
                  Avatar
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 font-medium">
                  Email
                </th>
                {/* future fields:
                <th scope="col" className="px-6 py-3 font-medium">Role</th>
                <th scope="col" className="px-6 py-3 font-medium">Team</th>
                */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-7">
                      <div className="w-8 h-8 rounded-full bg-gray-200" />
                    </td>
                    <td className="px-6 py-7">
                      <div className="h-3 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="px-6 py-7">
                      <div className="h-3 w-32 bg-gray-100 rounded" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={3} className="px-6 py-7">
                    Failed to load profiles.
                  </td>
                </tr>
              ) : (
                profiles?.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-7">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={user.avatar_url || "/default-avatar.png"}
                          alt={`${user.display_name}'s avatar`}
                          width={32}
                          height={32}
                          className="rounded-full border border-gray-200 object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-7 font-medium text-gray-900">
                      {user.display_name}
                    </td>
                    <td className="px-6 py-7 text-gray-600">{user.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </AuthLayout>
  );
}
