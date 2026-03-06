/**
 * SHRINE AI - Supabase Browser Client
 *
 * Creates a Supabase client for use in Client Components (browser).
 * Uses @supabase/ssr for cookie-based session management.
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
