import Link from "next/link";

export default function Categories({ categories }) {
  return (
    <section className="px-5 py-16 relative">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <span className="text-2xl text-accent/20 font-script leading-none">❀</span>
          <h2 className="font-script text-4xl text-text mt-1">
            Categories
          </h2>
          <div className="w-8 h-[2px] bg-accent/30 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center gap-3 rounded-2xl bg-surface border border-border p-6 active:scale-[0.97] transition-transform hover:border-accent/30"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-sm font-medium text-text">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
