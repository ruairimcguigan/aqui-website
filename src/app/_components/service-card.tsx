import Image from "next/image";

type Props = {
  title: string;
  description: string;
  image?: string;
};

export function ServiceCard({ title, description, image }: Props) {
  return (
    <div>
      <div className="mb-5">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={400}
            height={200}
            className="w-full h-[280px] object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-[280px] bg-gradient-to-b from-neutral-200 to-white dark:from-slate-700 dark:to-slate-900 rounded-lg" />
        )}
      </div>
      <h3 className="text-3xl mb-3 leading-snug font-bold tracking-tight">
        {title}
      </h3>
      <p className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    </div>
  );
}
