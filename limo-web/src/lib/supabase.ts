// ==============================================================================
// LIMO WEB — SUPABASE CLIENT CONFIGURATION
// Connects to Supabase PostgreSQL, manages browser sessions, and fallback state
// ==============================================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lrjmkfblhmczqxfqdohd.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyam1rZmJsaG1jenF4ZnFkb2hkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NjIxNzUsImV4cCI6MjEwODMzODE3NX0.XV8AijqbUbaOdVdPliXeovNcU4huHtFO4ZODsrqDgVQ';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Client-side Supabase client (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Server-only privileged Supabase client (bypasses RLS for admin operations)
export function getAdminSupabase() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for privileged server operations.');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
