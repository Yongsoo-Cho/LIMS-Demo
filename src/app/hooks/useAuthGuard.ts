"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/config/supabaseClient";

export function useAuthGuard() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data?.user) {
        setIsAuthed(true);
      } else {
        setIsAuthed(false);
        router.replace("/login");
      }

      setIsChecking(false);
    };

    checkUser();
  }, [router]);

  return { isChecking, isAuthed };
}
