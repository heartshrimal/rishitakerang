'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

const DEFAULTS = [
  '🎉 Sale! Up to 20% off on select items',
  '🚚 Free shipping on orders above ₹2000',
  '💝 Handmade with love, just for you',
  '✨ Custom orders welcome — DM to customize',
];

export default function ScrollingBanner() {
  const [items, setItems] = useState(DEFAULTS);

  useEffect(() => {
    const saved = localStorage.getItem('banner_items');
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch {}
    }

    function onUpdate() {
      const s = localStorage.getItem('banner_items');
      if (s) {
        try { setItems(JSON.parse(s)); } catch {}
      }
    }
    window.addEventListener('banner-update', onUpdate);
    return () => window.removeEventListener('banner-update', onUpdate);
  }, []);

  const copies = useMemo(() => Array.from({ length: 1000 }, () => items).flat(), [items]);

  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let offset = 0;
    let rafId;

    function animate() {
      offset -= 1.2;
      track.style.transform = `translateX(${Math.round(offset)}px)`;
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [items]);

  if (!items.length) return null;

  return (
    <div className="sticky top-15 z-40 w-full overflow-hidden bg-mlue border-y border-mlue/20 py-2">
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {copies.map((text, i) => (
          <span key={i} className="text-xs font-medium text-text/70 tracking-wide shrink-0 mr-12">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
