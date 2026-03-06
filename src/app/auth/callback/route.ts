/**
 * SHRINE AI - Auth Callback Route Handler
 *
 * Handles the OAuth callback from Supabase after Google sign-in.
 * Exchanges the authorization code for a session and redirects to the dashboard.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // If there's an error or no code, redirect to login with error
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
