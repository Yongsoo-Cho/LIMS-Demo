import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL or key is not defined. Find Supabase configuration on Supabase web portal.",
  );
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
