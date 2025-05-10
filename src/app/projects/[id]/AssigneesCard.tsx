import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AssigneesCard({
  assigneeIds,
  profiles,
}: {
  assigneeIds: string[];
  profiles: Record<string, { display_name: string | null; avatar_url: string | null }>;
}) {
  return (
    <div className="bg-gray-100 p-4 rounded">
      <h3 className="text-sm font-medium text-gray-600 mb-1">Assignees</h3>
      <div className="flex -space-x-2 overflow-hidden">
        {assigneeIds.map((id) => {
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
      </div>
    </div>
  );
}