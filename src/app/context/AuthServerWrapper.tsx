import { createClient } from "@/lib/supabase/serverClient";
import { AuthProvider } from "./AuthProvider";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function AuthServerWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data: userProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error(
        `Error fetching profile for user ${user.id}:`,
        profileError.message,
      );
    } else {
      profile = userProfile;
    }
  }

  return (
    <AuthProvider serverUser={user} serverProfile={profile}>
      {children}
    </AuthProvider>
  );
}
