import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[80vh] flex flex-col items-center justify-center px-5 text-center">
      <span className="text-7xl md:text-8xl font-script text-accent/30 leading-none">
        ✦
      </span>
      <h1 className="font-script text-6xl md:text-7xl text-text mt-4 leading-tight">
        Not Found
      </h1>
      <div className="w-8 h-[2px] bg-accent/30 mx-auto mt-4" />
      <p className="text-sm text-muted mt-5 max-w-xs leading-relaxed">
        This page doesn&apos;t exist. It might have been moved or the link might be incorrect.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-2xl bg-text px-8 py-3.5 text-background font-medium text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
      >
        Back to Home →
      </Link>
    </section>
  );
}
