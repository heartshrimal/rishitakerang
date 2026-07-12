"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "Search products..." }) {
  const [local, setLocal] = useState(value);
  const timer = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  function handleChange(e) {
    const v = e.target.value;
    setLocal(v);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(v), 300);
  }

  function handleClear() {
    setLocal("");
    onChange("");
    inputRef.current?.focus();
  }

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <div className="relative">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted/60 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-surface pl-11 pr-10 py-3.5 text-sm text-text outline-none focus:border-accent transition-colors placeholder:text-muted/40"
      />
      {local && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-soft flex items-center justify-center text-muted hover:text-text transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
