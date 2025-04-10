import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type NextRequest, type NextResponse } from "next/server"

//May have to refactor but currently this was the only reliable way I could get things working.
//Recommended getAll setAll functions do not properly set cookies and when reading OAuth code uses two different sessions.

//component: boolean = false consider adding for future
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: '', ...options });
        }
      },
      },
  )
}

export async function createSupabaseServerComponentClient() {
  const cookieStore = await cookies();
  cookieStore.getAll();
  return createClient();
}

export async function createSupabaseReqResClient(
  req: NextRequest,
  res: NextResponse
) {
  const cookieStore = await cookies();
  cookieStore.getAll();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );
}