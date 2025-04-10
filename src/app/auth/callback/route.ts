import { NextResponse } from 'next/server'
import { createSupabaseServerComponentClient } from '@/lib/supabase/serverClient'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createSupabaseServerComponentClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    console.log(error);
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  console.error("Error exchanging code for session or missing code");
  const redirectUrl = `${origin}/auth/auth-code-error`; // Create an error page at this route
  return NextResponse.redirect(redirectUrl);
}