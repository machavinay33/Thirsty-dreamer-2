import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="wrap flex min-h-screen flex-col items-start justify-center gap-6 py-24">
      <p className="eyebrow">404 · Off the menu</p>
      <h1 className="display-lg max-w-3xl">This page isn’t on tonight’s list.</h1>
      <p className="lede">The link may be old, or the page may have moved. Head back to the bar and start again.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">Back to home</Link>
        <Link href="/journal" className="btn-ghost">Read the journal</Link>
      </div>
    </main>
  );
}
