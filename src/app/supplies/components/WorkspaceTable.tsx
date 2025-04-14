"use client";

import Link from "next/link";
import { SupplyFolder } from "../action";

type Props = {
  workspaces: SupplyFolder[];
};

export default function WorkspaceTable({ workspaces }: Props) {
  return (
    <section>
      <table className="min-w-full text-sm text-left border-collapse">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-2 whitespace-nowrap">Title</th>
            <th className="px-4 py-2 whitespace-nowrap w-40">Created</th>
            <th className="px-4 py-2 whitespace-nowrap">Description</th>
          </tr>
        </thead>
        <tbody>
          {workspaces.map((ws) => (
            <tr
              key={ws.id}
              className="border-b border-b-gray-200 hover:bg-blue-50 transition cursor-pointer"
            >
              <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                <Link href={`/supplies/${ws.id}`} className="hover:underline">
                  {ws.title}
                </Link>
              </td>
              <td className="px-4 py-2 text-gray-700 whitespace-nowrap w-40">
                {new Date(ws.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                {ws.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
