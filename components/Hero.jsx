
export default function Hero() {
  return (
    <section className="relative flex min-h-[60vh] pt-20 flex-col justify-center px-5">
      <img
        src="/post_it_note_2.png"
        alt="Post it note"
        className="absolute -top-5 right-4 w-35 rotate-15 pointer-events-none select-none"
      />
      {/* <img
        src="/1000167906.png"
        alt="Post it note"
        className="absolute top-60 right-[-5px] w-30 rotate-[15deg] pointer-events-none select-none"
      /> */}
      <img
        src="/1000167916.png"
        alt="Post it note"
        className="absolute -top-20 -left-2 w-40 rotate-[-25deg] pointer-events-none select-none"
      />
      <img
        src="/1000167914.png"
        alt="Post it note"
        className="absolute top-80 right-0 w-30 rotate-15 pointer-events-none select-none"
      />
      <img
        src="/1000167915.png"
        alt="Post it note"
        className="absolute top-0 right-40 w-30 rotate-[deg] pointer-events-none select-none"
      />
      <img
        src="/1000167913.png"
        alt="Post it note"
        className="absolute -bottom-20 left-4 w-30 rotate-[-30deg] pointer-events-none select-none"
      />
      <img
        src="/frames.png"
        alt="Post it note"
        className="absolute -bottom-5 right-10 w-30 rotate-[-30deg] pointer-events-none select-none"
      />
      <img
        src="/diet-coke-earrings.png"
        alt="Post it note"
        className="absolute -bottom-35 right-40 w-30 pointer-events-none select-none"
      />
      <img
        src="/heart-earrings.png"
        alt="Post it note"
        className="absolute top-35 right-0 w-30 -rotate-12 pointer-events-none select-none"
      />

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
