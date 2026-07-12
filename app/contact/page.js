export const metadata = {
  title: "Contact",
  description:
    "Get in touch with Rishita Ke Rang for custom clay orders, bulk enquiries, collaborations, or just to say hello. DM us on Instagram @rishita.ke.rang.",
  keywords: [
    "rishita ke rang contact",
    "rishita ke rang instagram",
    "custom clay order india",
    "bulk clay order",
    "clay art enquiry",
    "rishitakerang contact",
  ],
  openGraph: {
    title: "Contact — Rishita Ke Rang",
    description:
      "Get in touch for custom clay orders, bulk enquiries, or collaborations.",
  },
};

export default function ContactPage() {
  return (
    <main className="px-5 pb-20">
      <div className="max-w-lg mx-auto w-full pt-12 animate-[fadeIn_0.6s_ease-out]">
        <span className="inline-block mb-4 text-[10px] uppercase tracking-[0.35em] text-muted font-medium">
          Get in Touch
        </span>

        <h1 className="font-script text-5xl md:text-6xl leading-[1.1] text-text mb-2">
          Let&apos;s
          <br />
          <span className="text-primary">Connect</span>
        </h1>

        <div className="w-12 h-[2px] bg-accent/40 mt-5 mb-8" />

        <p className="text-base text-muted leading-relaxed mb-10">
          Got a custom order in mind? Want to collaborate? Or just feel like
          saying hi — I&apos;d love to hear from you.
        </p>

        <div className="space-y-4">
          <a
            href="https://ig.me/m/rishita.ke.rang"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 w-full rounded-2xl bg-soft/80 border border-border/50 px-5 py-4 text-text hover:bg-soft transition-colors group"
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/15 text-primary text-lg group-hover:scale-110 transition-transform shrink-0">
              📷
            </span>
            <div>
              <p className="font-medium text-sm">Instagram DM</p>
              <p className="text-xs text-muted/60">@rishita.ke.rang</p>
            </div>
            <span className="ml-auto text-muted/40 text-sm">→</span>
          </a>
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border border-border/50">
          <h2 className="font-display text-lg font-semibold text-text mb-2">
            Custom Orders
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Want something unique? Tell me your idea — colors, theme, size — and
            I&apos;ll bring it to life. Custom orders typically take 3-7 days.
          </p>
          <a
            href="https://ig.me/m/rishita.ke.rang"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full rounded-2xl bg-text px-6 py-3.5 text-background font-medium text-sm text-center hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            Start a Conversation →
          </a>
        </div>

        <div className="mt-10 text-center">
          <div className="font-script text-3xl text-primary/40">💛</div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted/40 font-medium mt-4">
            Can&apos;t wait to create for you
          </p>
        </div>
      </div>
    </main>
  );
}
