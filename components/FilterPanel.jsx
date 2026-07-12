"use client";

import { useRef, useCallback, useEffect, useState } from "react";

const SLIDER_MIN = 0;
const SLIDER_MAX = 2000;
const STEP = 50;

function snap(val) {
  return Math.round(val / STEP) * STEP;
}

function DualRangeSlider({ min, max, onChange }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const vals = useRef({ min, max });
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    vals.current = { min, max };
  }, [min, max]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const fromClientX = useCallback((clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return snap(SLIDER_MIN + pct * (SLIDER_MAX - SLIDER_MIN));
  }, []);

  useEffect(() => {
    if (!dragging) return;

    function onMove(e) {
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const val = fromClientX(clientX);
      const { min: curMin, max: curMax } = vals.current;

      if (dragging === "min") {
        const newMin = Math.min(val, curMax - STEP);
        if (newMin !== curMin) onChangeRef.current({ min: newMin, max: curMax });
      } else {
        const newMax = Math.max(val, curMin + STEP);
        if (newMax !== curMax) onChangeRef.current({ min: curMin, max: newMax });
      }
    }

    function onUp() {
      setDragging(null);
    }

    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, fromClientX]);

  const leftPct = ((min - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
  const rightPct = ((max - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;

  return (
    <div className="select-none touch-none">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-text">₹{min}</span>
        <span className="text-xs text-muted/60">to</span>
        <span className="text-sm font-medium text-text">
          ₹{max >= SLIDER_MAX ? `${max}+` : max}
        </span>
      </div>

      <div
        ref={trackRef}
        className="relative h-10 flex items-center"
      >
        <div className="absolute w-full h-1.5 rounded-full bg-border" />
        <div
          className="absolute h-1.5 rounded-full bg-text"
          style={{
            left: `${leftPct}%`,
            width: `${rightPct - leftPct}%`,
          }}
        />

        <div
          onMouseDown={(e) => { e.preventDefault(); setDragging("min"); }}
          onTouchStart={(e) => { e.preventDefault(); setDragging("min"); }}
          className="absolute w-7 h-7 rounded-full bg-text border-[3px] border-background shadow-lg cursor-grab active:cursor-grabbing -translate-x-1/2 z-10"
          style={{ left: `${leftPct}%` }}
        />
        <div
          onMouseDown={(e) => { e.preventDefault(); setDragging("max"); }}
          onTouchStart={(e) => { e.preventDefault(); setDragging("max"); }}
          className="absolute w-7 h-7 rounded-full bg-text border-[3px] border-background shadow-lg cursor-grab active:cursor-grabbing -translate-x-1/2 z-10"
          style={{ left: `${rightPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-muted/50">₹0</span>
        <span className="text-[10px] text-muted/50">₹2000</span>
      </div>
    </div>
  );
}

export default function FilterPanel({
  categories,
  activeCategory,
  onCategoryChange,
  activePrice,
  onPriceChange,
  sortBy,
  onSortChange,
}) {
  const isPriceActive = activePrice.min > 0 || activePrice.max < SLIDER_MAX;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => onCategoryChange("")}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium border transition-colors ${
            !activeCategory
              ? "bg-text text-background border-text"
              : "bg-surface text-text border-border hover:border-accent/40"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onCategoryChange(activeCategory === cat.slug ? "" : cat.slug)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              activeCategory === cat.slug
                ? "bg-text text-background border-text"
                : "bg-surface text-text border-border hover:border-accent/40"
            }`}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-surface border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-text">Price Range</span>
          {isPriceActive && (
            <button
              onClick={() => onPriceChange({ min: SLIDER_MIN, max: SLIDER_MAX })}
              className="text-[10px] text-accent hover:text-primary transition-colors"
            >
              Reset
            </button>
          )}
        </div>
        <DualRangeSlider
          min={activePrice.min}
          max={activePrice.max}
          onChange={onPriceChange}
        />
      </div>

      <div className="flex items-center overflow-x-auto pb-1 scrollbar-hide">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="shrink-0 rounded-full px-4 py-2 text-xs font-medium border border-border bg-surface text-text outline-none focus:border-accent transition-colors cursor-pointer"
        >
          <option value="default">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
    </div>
  );
}
