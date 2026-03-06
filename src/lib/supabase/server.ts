/**
 * SHRINE AI - Supabase Server Client
 *
 * Creates a Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Uses Next.js cookies() for session management.
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            // Omit domain to prevent cross-subdomain/preview cookie loss on Vercel
                            const { domain, ...cleanOptions } = options;
                            cookieStore.set(name, value, {
                                ...cleanOptions,
                                secure: process.env.NODE_ENV === 'production' || cleanOptions.secure,
                                sameSite: 'lax',
                            });
                        });
                    } catch {
                        // The `setAll` method is called from a Server Component.
                        // This can be ignored if you have middleware refreshing sessions.
                    }
                },
            },
        }
    );
}
