"use server";

import { createSupabaseServerComponentClient } from "@/lib/supabase/serverClient";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const slackLogin = async (): Promise<string> => {
  const supabase = await createSupabaseServerComponentClient();
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");

  if (!origin) {
    console.error("Missing origin header");
    return redirect("/login?error=OriginMissing");
  }

  const slackWorkspaceId = process.env.NEXT_PUBLIC_SLACK_WORKSPACE_ID;
  if (!slackWorkspaceId) {
    console.error("Missing Slack workspace ID configuration");
    return redirect("/login?error=ConfigurationError");
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "slack_oidc",
    options: {
      redirectTo: `${origin}/auth/callback`,
      scopes: "openid profile email",
      queryParams: {
        team: slackWorkspaceId,
      },
    },
  });

  if (error) {
    console.error("Error signing in with Slack:", error);
    return redirect(
      `/login?error=OAuthSigninFailed&message=${encodeURIComponent(error.message)}`,
    );
  }

  if (data.url) {
    return redirect(data.url);
  } else {
    console.error("signInWithOAuth did not return a URL");
    return redirect("/login?error=OAuthConfigurationError");
  }
};

// export const discordLogin = async (): Promise<string> => {
//   const supabase = await createSupabaseServerComponentClient();
//   const requestHeaders = await headers();
//   const origin = requestHeaders.get("origin");

//   if (!origin) {
//     console.error("Missing origin header");
//     return redirect("/login?error=OriginMissing");
//   }

//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: "discord",
//     options: {
//       redirectTo: `${origin}/auth/callback`,
//     },
//   });

//   if (error) {
//     console.error("Error signing in with Discord:", error);
//     return redirect(
//       `/login?error=OAuthSigninFailed&message=${encodeURIComponent(error.message)}`,
//     );
//   }

//   if (data.url) {
//     return redirect(data.url);
//   } else {
//     console.error("signInWithOAuth did not return a URL");
//     return redirect("/login?error=OAuthConfigurationError");
//   }
// };
