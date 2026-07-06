import Container from "@/app/_components/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Side Projects | Aqui",
  description: "A few things we've built outside of client work.",
};

const projects = [
  {
    name: "Maestro",
    suffix: "for Sonos",
    description:
      "A fast, local-first controller for Sonos — native across the Mac menu bar, iPhone, iPad, Apple Watch and Android. No account, no cloud, no subscription: it talks straight to your speakers over your own network, with scenes, EQ presets and room grouping always a tap away. Explore the site, privacy policy and support pages.",
    href: "/portfolio/maestro/",
    image: "/portfolio/maestro/assets/maestro-logo-512.png",
  },
];

export default function Portfolio() {
  return (
    <main>
      <Container>
        <section className="mt-16 mb-20 md:mb-28">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight mb-6">
            Side Projects
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 md:pr-8 max-w-2xl">
            A few things we&apos;ve built outside of client work.
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-16 lg:gap-x-20 gap-y-20 mb-20 md:mb-28">
            {projects.map((project) => (
              <a
                key={project.name}
                href={project.href}
                className="group block"
              >
                <div className="mb-5">
                  <div className="w-full h-[280px] flex items-center justify-center gap-4 px-6 bg-gradient-to-b from-neutral-100 to-white dark:from-slate-700 dark:to-slate-900 rounded-lg overflow-hidden transition-shadow group-hover:shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt=""
                      className="h-14 w-auto object-contain"
                    />
                    <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
                      {project.name}{" "}
                      <span className="font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        {project.suffix}
                      </span>
                    </span>
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {project.description}
                </p>
              </a>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
