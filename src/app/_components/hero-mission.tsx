import Image from "next/image";

export function HeroMission() {
  return (
    <section>
      <div className="mb-12 md:mb-24">
        <Image
          src="/assets/hero/hero-banner.jpg"
          alt="Abstract geometric line art illustration"
          width={1920}
          height={500}
          className="w-full h-[400px] md:h-[500px] object-cover rounded-lg"
          priority
        />
      </div>
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start mb-20 md:mb-28">
        <div className="flex-1">
          <h2 className="mb-6 text-4xl lg:text-6xl leading-tight font-bold tracking-tighter">
            Engineering digital ambition.
          </h2>
          <p className="text-xl md:text-2xl leading-relaxed mb-8 text-neutral-700 dark:text-neutral-300">
            From concept to production. We build high-performance web and mobile
            solutions for industry leaders and innovative startups.
          </p>
          <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            Aqui bridges the gap between complex business requirements and
            beautiful user experiences. We specialise across a range of languages and frameworks, including Java, Kotlin, Kotlin Multiplatform, Flutter, React, and
            TypeScript, we deliver robust, first-to-market solutions for banking,
            fintech, and consumer sectors.
          </p>
        </div>
        <div className="w-full md:w-[300px] lg:w-[400px] flex-shrink-0">
          <Image
            src="/assets/images/culture.jpg"
            alt="Company culture"
            width={400}
            height={300}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
}
