import { ServiceCard } from "./service-card";

const services = [
  {
    title: "Mobile Engineering",
    description:
      "Expert delivery in Kotlin (Android) and Flutter. We build aspirational, business-led mobile experiences.",
    image: "/assets/images/mobile-dev.jpg",
  },
  {
    title: "Web & Frontend",
    description:
      "Scalable architecture using React and TypeScript. From internal tools to consumer-facing products.",
    image: "/assets/images/web-frontend-two.jpg",
  },
  {
    title: "Enterprise Solutions",
    description:
      "Experience delivering large-scale enterprise functionality for existing and innovative first-to-market products.",
    image: "/assets/images/enterprise-solutions.jpg",
  },
];

export function Services() {
  return (
    <section>
      <h2 className="mb-8 text-4xl lg:text-6xl font-bold tracking-tighter leading-tight">
        Our Expertise
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-16 lg:gap-x-20 gap-y-20 mb-20 md:mb-28">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            description={service.description}
            image={service.image}
          />
        ))}
      </div>
    </section>
  );
}
