// app/auth-provider.tsx (or similar path)
'use client';

import React, { createContext, useContext } from 'react';
import type { Database } from '@/lib/database.types';
import type { User } from '@supabase/supabase-js'

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null; // Include profile in the context type
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null, // Default profile to null
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({
  children,
  serverUser = null,
  serverProfile = null, // Accept server-fetched profile
}: {
  children: React.ReactNode;
  serverUser?: User | null;
  serverProfile?: Profile | null;
}) {
  // Provide both user and profile in the context value
  const value = { user: serverUser, profile: serverProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
