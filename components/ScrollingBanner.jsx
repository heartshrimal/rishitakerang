export default function ScrollingBanner() {
  const items = [
    '🎉 Sale! Up to 20% off on select items',
    '🚚 Free shipping on orders above ₹2000',
    '💝 Handmade with love, just for you',
    '✨ Custom orders welcome — DM to enquire',
  ];

  return (
    <div className="sticky top-16 z-40 w-full overflow-hidden bg-mlue border-y border-mlue/20 py-2">
      <div className="flex animate-[marquee_10s_linear_infinite] gap-12 whitespace-nowrap">
        {[...items, ...items].map((text, i) => (
          <span key={i} className="text-xs font-medium text-text/70 tracking-wide">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
