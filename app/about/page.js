export const metadata = {
  title: "About",
  description:
    "Learn the story behind Rishita Ke Rang — a handmade polymer clay art brand. Hand-sculpted charms, earrings, keychains and frames, each made with love in India.",
  keywords: [
    "rishita ke rang about",
    "rishitakerang story",
    "handmade clay art india",
    "polymer clay artist",
    "about rishita ke rang",
    "clay art brand india",
  ],
  openGraph: {
    title: "About — Rishita Ke Rang",
    description:
      "The story behind Rishita Ke Rang — handcrafted clay art made with love, patience, and a whole lot of heart.",
  },
};

export default function AboutPage() {
  return (
    <main className="px-5 pb-20">
      <div className="max-w-lg mx-auto w-full pt-12 animate-[fadeIn_0.6s_ease-out]">
        <span className="inline-block mb-4 text-[10px] uppercase tracking-[0.35em] text-muted font-medium">
          About
        </span>

        <h1 className="font-script text-5xl md:text-6xl leading-[1.1] text-text mb-2">
          The Story
          <br />
          <span className="text-primary">Behind the Clay</span>
        </h1>

        <div className="w-12 h-[2px] bg-accent/40 mt-5 mb-8" />

        <div className="space-y-5 text-base text-muted leading-relaxed">
          <p>
            Rishita Ke Rang was born from a simple love for colors, shapes, and
            the quiet joy of making something with your hands. What started as a
            small creative escape quickly turned into something bigger —
            miniature worlds sculpted from polymer clay, each piece carrying a
            story.
          </p>

          <p>
            Every charm, frame, and earring is shaped, baked, and finished by
            hand. No molds, no mass production — just raw creativity and a whole
            lot of patience. I believe the best things in life are the ones made
            slowly, carefully, and with intention.
          </p>

          <p>
            The name <span className="font-semibold text-text">Rishita Ke Rang</span>{" "}
            reflects that philosophy — it&apos;s not just about the final product,
            but about the colours (rang) that go into it. The messy, beautiful
            process of turning a lump of clay into something that makes you
            smile.
          </p>
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-soft/80 border border-border/50">
          <h2 className="font-display text-lg font-semibold text-text mb-3">
            Made With Love
          </h2>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-start gap-3">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              Every piece is hand-sculpted — no two are exactly alike
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              Custom orders welcome — pick your colors, initials, and style
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              Finished with a water-resistant coating for lasting wear
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              Packed with care in eco-friendly packaging
            </li>
          </ul>
        </div>

        <div className="mt-10 text-center">
          <div className="font-script text-3xl text-primary/40">✨</div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted/40 font-medium mt-4">
            Every piece made with love
          </p>
        </div>
      </div>
    </main>
  );
}
