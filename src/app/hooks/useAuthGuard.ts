import { useEffect, useState } from "react";
import { supabase } from "@/app/config/supabaseClient";

export function useAuthGuard() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const sessionFromCache = sessionStorage.getItem("authed");

    if (sessionFromCache === "true") {
      setIsAuthed(true);
      setIsChecking(false);
      return;
    }

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const isLoggedIn = !!session?.user;
      setIsAuthed(isLoggedIn);
      sessionStorage.setItem("authed", String(isLoggedIn));
      setIsChecking(false);
    };

    checkSession();
  }, []);

  return { isChecking, isAuthed };
}