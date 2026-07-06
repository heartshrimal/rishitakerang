'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

export default function ScrollingBanner() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    function load() {
      fetch('/api/banner')
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length) setItems(data);
        })
        .catch(() => {});
    }

    load();
    window.addEventListener('banner-update', load);
    return () => window.removeEventListener('banner-update', load);
  }, []);

  const texts = useMemo(() => items.map((i) => i.text), [items]);
  const copies = useMemo(() => Array.from({ length: 1000 }, () => texts).flat(), [texts]);

  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !texts.length) return;

    let offset = 0;
    let rafId;

    function animate() {
      offset -= 1.2;
      track.style.transform = `translateX(${Math.round(offset)}px)`;
      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [texts]);

  if (!texts.length) return null;

  return (
    <div className="sticky top-15 z-40 w-full overflow-hidden bg-mlue/70 border-y border-mlue/20 py-2">
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
