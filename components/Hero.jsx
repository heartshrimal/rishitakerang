
export default function Hero() {
  return (
    <section className="relative flex min-h-[60vh] pt-20 flex-col justify-center px-5 overflow-hidden">
      {/* <div className="absolute top-16 right-6 text-6xl opacity-75 text-accent select-none font-script leading-none">
        ✦
      </div>
      <div className="absolute bottom-36 left-4 text-5xl opacity-75 text-secondary select-none font-script leading-none">
        ❀
      </div> */}
      {/* <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-7xl opacity-[0.04] text-primry select-none font-script leading-none pointer-events-none">
        Rishita Ke Rang
      </div> */}

      <div className="max-w-lg mx-auto w-full relative">
        <span className="inline-block mb-6 text-[10px] uppercase tracking-[0.35em] text-muted font-medium">
          Rishita Ke Rang
        </span>

        <h1 className="font-script text-[3rem] md:text-[4.5rem] leading-[1.1] tracking-normal text-text">
          A little world
          <br />
          <span className="text-darkmlue">of handmade things</span>
        </h1>

        <div className="w-12 h-[2px] bg-accent/40 mt-6 mb-6" />

        <p className="text-base text-muted leading-relaxed max-w-xs">
          A collection of handmade objects, thoughtful gifts and little pieces of art designed to make everyday moments feel a bit more special
        </p>

        

        <div className="mt-10 text-[10px] uppercase tracking-[0.3em] text-muted/40 text-center font-medium">
          ✦ handmade with love ✦
        </div>
      </div>
    </section>
  );
}
