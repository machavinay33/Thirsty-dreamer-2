import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getStaff } from '@/lib/auth';
import { hasSupabase } from '@/lib/env';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  if (hasSupabase && (await getStaff())) redirect('/admin');
  const { next, error } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <Image src="/logo-cream.png" alt="Thirsty Dreamer" width={1000} height={666} className="mx-auto h-28 w-auto" priority />
        <h1 className="mt-6 text-center font-serif text-3xl text-cream">Admin sign in</h1>
        <div className="card mt-8">
          {hasSupabase ? (
            <LoginForm next={next} notice={error ? 'You’re signed in, but this account does not have dashboard access.' : undefined} />
          ) : (
            <p role="alert" className="text-sm text-cream/80">
              Supabase isn’t configured yet. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see README), then reload.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
