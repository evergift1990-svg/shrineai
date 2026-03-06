/**
 * SHRINE AI - Login Page
 *
 * Premium login page with Google-only authentication.
 * Matches the Shrine dark sanctuary aesthetic with amber/gold accents.
 *
 * Logic:
 * 1. Full-screen dark atmospheric background with shrine grid + glow
 * 2. Centered glassmorphic login card
 * 3. Google sign-in button (only auth method)
 * 4. Animated entrance with framer-motion
 * 5. Error handling for failed auth attempts
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Shield, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
            />
            <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
            />
            <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
            />
            <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
            />
        </svg>
    );
}

function LoginContent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const authError = searchParams.get('error');

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });

            if (error) {
                setError(error.message);
                setLoading(false);
            }
        } catch {
            setError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950">
            {/* Ambient Background Effects */}
            <div className="pointer-events-none fixed inset-0 shrine-grid-bg" />
            <div className="pointer-events-none fixed inset-0 shrine-radial-glow" />

            {/* Floating ambient orbs */}
            <motion.div
                className="pointer-events-none absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl"
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />
            <motion.div
                className="pointer-events-none absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-amber-600/5 blur-3xl"
                animate={{
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Login Card */}
            <motion.div
                className="relative z-10 w-full max-w-md px-4"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="relative overflow-hidden rounded-2xl border border-amber-400/10 bg-zinc-900/60 p-8 backdrop-blur-2xl">
                    {/* Card inner glow */}
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-400/5 via-transparent to-transparent" />
                    <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-amber-400/10 blur-3xl" />

                    {/* Logo Section */}
                    <motion.div
                        className="relative mb-8 flex flex-col items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="relative mb-4">
                            <motion.div
                                className="rounded-2xl border border-amber-400/20 bg-zinc-800/50 p-4"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <Flame className="h-10 w-10 text-amber-400" />
                            </motion.div>
                            <div className="absolute inset-0 animate-pulse rounded-2xl bg-amber-400/10 blur-xl" />
                        </div>

                        <h1 className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-3xl font-bold tracking-wider text-transparent">
                            SHRINE
                        </h1>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.35em] text-zinc-500">
                            AI Sanctuary
                        </p>
                    </motion.div>

                    {/* Divider with icon */}
                    <motion.div
                        className="relative mb-8 flex items-center justify-center"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                        <div className="mx-4 flex items-center gap-2 text-zinc-600">
                            <Shield className="h-3.5 w-3.5" />
                            <span className="text-[10px] uppercase tracking-widest">
                                Secure Access
                            </span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                    </motion.div>

                    {/* Error Message */}
                    {(error || authError) && (
                        <motion.div
                            className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {error || 'Authentication failed. Please try again.'}
                        </motion.div>
                    )}

                    {/* Google Sign-in Button */}
                    <motion.button
                        id="google-sign-in-button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="group relative flex w-full items-center justify-center gap-3 rounded-xl border border-amber-400/15 bg-zinc-800/50 px-6 py-4 text-sm font-medium text-zinc-200 transition-all duration-300 hover:border-amber-400/30 hover:bg-zinc-800/80 hover:text-amber-200 hover:shadow-lg hover:shadow-amber-400/5 disabled:cursor-not-allowed disabled:opacity-50"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        {loading ? (
                            <>
                                <motion.div
                                    className="h-5 w-5 rounded-full border-2 border-amber-400/30 border-t-amber-400"
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                />
                                <span>Connecting...</span>
                            </>
                        ) : (
                            <>
                                <GoogleIcon className="h-5 w-5" />
                                <span>Continue with Google</span>
                                <Sparkles className="ml-auto h-4 w-4 text-amber-400/40 transition-all duration-300 group-hover:text-amber-400/80" />
                            </>
                        )}
                    </motion.button>

                    {/* Info text */}
                    <motion.p
                        className="mt-6 text-center text-[11px] leading-relaxed text-zinc-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        By continuing, you agree to access the Shrine AI Sanctuary.
                        <br />
                        Only Google accounts are accepted.
                    </motion.p>
                </div>

                {/* Bottom accent */}
                <motion.div
                    className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-amber-400/0 via-amber-400/30 to-amber-400/0"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                />
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-zinc-950">
                    <motion.div
                        className="h-8 w-8 rounded-full border-2 border-amber-400/30 border-t-amber-400"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                </div>
            }
        >
            <LoginContent />
        </Suspense>
    );
}
