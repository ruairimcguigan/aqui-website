import Container from "@/app/_components/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Side Projects | Aqui",
  description: "A few things we've built for fun outside client work.",
};

const projects = [
  {
    title: "Maestro",
    description:
      "A native iOS and Android app for controlling your Sonos speakers. Explore the site, privacy policy and support pages.",
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
            A few things we&apos;ve built for fun outside client work.
          </p>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-16 lg:gap-x-20 gap-y-20 mb-20 md:mb-28">
            {projects.map((project) => (
              <a
                key={project.title}
                href={project.href}
                className="group block"
              >
                <div className="mb-5">
                  <div className="w-full h-[280px] flex items-center justify-center bg-gradient-to-b from-neutral-100 to-white dark:from-slate-700 dark:to-slate-900 rounded-lg overflow-hidden transition-shadow group-hover:shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-24 w-auto object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-3xl mb-3 leading-snug font-bold tracking-tight group-hover:text-brand-blue transition-colors">
                  {project.title}
                </h3>
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
