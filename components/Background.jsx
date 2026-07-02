'use client';

export default function Background() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        backgroundImage: 'url("/background/yellow grid.jpg")',
        backgroundSize: '50%',
        backgroundRepeat: 'repeat',
      }}
      aria-hidden
    />
  );
}
