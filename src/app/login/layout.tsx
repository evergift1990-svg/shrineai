/**
 * SHRINE AI - Login Layout
 *
 * Minimal layout for the login page — no header, sidebar, or providers
 * that depend on authenticated state.
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SHRINE — Sign In',
    description: 'Sign in to your SHRINE AI Sanctuary with Google.',
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
