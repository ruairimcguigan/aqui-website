import Image from "next/image";

const clients = [
  { name: "Deliveroo", logo: "/assets/clients/deliveroo.png" },
  { name: "Santander Bank", logo: "/assets/clients/santander.png" },
  { name: "Deloitte Digital", logo: "/assets/clients/deloittedigital.webp" },
  { name: "JustEat", logo: "/assets/clients/justeat.png" },
  { name: "Virgin Money", logo: "/assets/clients/virginmoney.png" },
  { name: "Vhi Healthcare", logo: "/assets/clients/vhi.png", size: "small" },
  {
    name: "Noumena Digital AG",
    logo: "/assets/clients/noumena_two.png",
    size: "large",
  },
  { name: "Allstate Insurance", logo: "/assets/clients/allstate.png" },
] as const;

export function TrustedBy() {
  return (
    <section className="bg-gray-50 dark:bg-slate-800 -mx-5 px-5 py-10 mb-20 md:mb-28">
      <div className="mx-auto">
        <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-10">
          Trusted By
        </h3>
        <div className="flex justify-between items-center w-full px-8 md:px-16">
          {clients.map((client) => (
            <div
              key={client.name}
              className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <div
                className={`flex items-center justify-center flex-shrink-0 ${
                  client.size === "small"
                    ? "w-16 md:w-20 h-8"
                    : client.size === "large"
                      ? "w-32 md:w-36 h-12"
                      : "w-24 md:w-28 h-10"
                }`}
              >
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={128}
                  height={48}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
