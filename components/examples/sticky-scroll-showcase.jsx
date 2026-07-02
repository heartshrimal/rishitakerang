'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function ProductPanel({ product, index }) {
  const [progress, setProgress] = useState(0);
  const side = index % 2 === 0 ? 'left' : 'right';

  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const raw = (window.scrollY - (index + 1) * vh) / vh;
      setProgress(Math.max(0, Math.min(1, raw)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [index]);

  const translateX = side === 'left'
    ? `${-(1 - progress) * 100}%`
    : `${(1 - progress) * 100}%`;

  return (
    <section
      className="sticky top-0 min-h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12 px-5 max-w-5xl mx-auto w-full">
        <div
          className={`w-full md:w-1/2 flex justify-center ${side === 'right' ? 'md:order-2' : ''}`}
          style={{ transform: `translateX(${translateX})` }}
        >
          <div className="relative w-56 h-56 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 224px, 320px"
              />
            ) : (
              <div className="w-full h-full bg-soft flex items-center justify-center text-muted/40 text-6xl">
                ✦
              </div>
            )}
          </div>
        </div>
        <div
          className={`w-full md:w-1/2 text-center md:text-left ${side === 'right' ? 'md:order-1 md:text-right' : ''}`}
          style={{ opacity: 1 - progress }}
        >
          <span className="inline-block text-[10px] uppercase tracking-[0.35em] text-muted font-medium mb-2">
            {product.category}
          </span>
          <h2 className="font-script text-4xl md:text-5xl text-text mb-3">
            {product.name}
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-3">
            {product.description}
          </p>
          <p className="text-lg font-display font-semibold text-text mb-5">
            ₹{product.price}+
          </p>
          <Link
            href={`/product/${product.id}`}
            className="inline-block rounded-2xl bg-text px-6 py-3 text-background font-medium text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            View Details →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function ProductShowcase({ products = [] }) {
  if (!products.length) return null;

  return (
    <div className="relative bg-gradient-to-b from-background via-primary/5 via-secondary/5 via-accent/5 to-background">
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-5">
        <span className="inline-block text-[10px] uppercase tracking-[0.35em] text-muted font-medium mb-4">
          Scroll Through
        </span>
        <h2 className="font-script text-5xl md:text-7xl text-text mb-4">
          The Collection
        </h2>
        <p className="text-muted text-sm max-w-md leading-relaxed mb-8">
          Each piece tells a story. Scroll down to see them come to life.
        </p>
        <div className="text-4xl text-primary/40 animate-bounce">↓</div>
      </section>
      {products.map((product, i) => (
        <ProductPanel key={product.id} product={product} index={i} />
      ))}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-5">
        <h2 className="font-script text-4xl md:text-6xl text-text mb-4">
          Want something unique?
        </h2>
        <p className="text-muted text-sm max-w-md leading-relaxed mb-8">
          Every piece is handcrafted just for you. Reach out and let&apos;s create something beautiful together.
        </p>
        <a
          href="https://ig.me/m/rishita.ke.rang"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-2xl bg-text px-8 py-4 text-background font-medium text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          Start a Conversation →
        </a>
      </section>
    </div>
  );
}
