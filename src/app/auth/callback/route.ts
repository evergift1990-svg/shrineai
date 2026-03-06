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
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (errorParam) {
        console.error('Auth callback received error from OAuth provider:', errorParam, errorDescription);
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription || errorParam)}`);
    }

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host');
            const isLocalEnv = process.env.NODE_ENV === 'development';

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                // Ensure redirect matches the forwarded host if operating behind a load balancer on Vercel
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        } else {
            console.error('Supabase exchangeCodeForSession error:', {
                message: error.message,
                status: error.status,
                name: error.name
            });
            return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message || 'auth_failed')}`);
        }
    }

    // If there's an error or no code, redirect to login with error
    console.warn('Auth callback missing code parameter');
    return NextResponse.redirect(`${origin}/login?error=invalid_request`);
}
