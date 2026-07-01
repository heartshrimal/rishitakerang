"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images, name }) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="px-5 pb-6">
      <div className="max-w-lg mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-soft aspect-square">
          <img
            src={images[index]}
            alt={`${name} — view ${index + 1}`}
            className="w-full h-full object-contain p-8"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-text hover:bg-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-text hover:bg-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === index ? "bg-white w-5" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === index ? "border-accent opacity-100" : "border-transparent opacity-60"
              }`}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
