import Image from "next/image";

type Client = {
  name: string;
  logo: string;
};

const clients: Client[] = [
  { name: "Deliveroo", logo: "/assets/clients/deliveroo.png" },
  { name: "Santander Bank", logo: "/assets/clients/santander.png" },
  { name: "Deloitte Digital", logo: "/assets/clients/deloittedigital.webp" },
  { name: "JustEat", logo: "/assets/clients/justeat.png" },
  { name: "Virgin Money", logo: "/assets/clients/virginmoney.png" },
  { name: "Vhi Healthcare", logo: "/assets/clients/vhi.png" },
  { name: "Noumena Digital AG", logo: "/assets/clients/noumena_two.png" },
  { name: "Allstate Insurance", logo: "/assets/clients/allstate.png" },
];

export function TrustedBy() {
  return (
    <section className="bg-gray-50 dark:bg-slate-800 -mx-5 px-5 py-10 mb-20 md:mb-28">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-8 md:mb-10">
          Trusted By
        </h3>
        {/* Mobile: 2x4 grid, Tablet: 4x2 grid, Desktop: single row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 md:gap-8 px-4 md:px-8">
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex items-center justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 dark:grayscale-0 dark:opacity-100 transition-all duration-300"
            >
              <Image
                src={client.logo}
                alt={client.name}
                width={120}
                height={40}
                className="w-auto h-8 md:h-10 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
