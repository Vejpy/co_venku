import Image from "next/image";
import { Source } from "@/types/source";

interface SourceItemProps {
  item: Source;
}

export default function SourceItemComponent({ item }: SourceItemProps) {
  return (
    <article className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all flex flex-col">
      <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
        {item.name}
      </h2>

      <p className="text-gray-600 dark:text-gray-400 mb-3">
        {item.description}
      </p>

      {item.imageUrl && (
        <div className="flex justify-center mb-3">
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={200}
            height={200}
            className="rounded-lg object-contain"
          />
        </div>
      )}

      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline mt-auto font-medium"
        >
          Navštívit
        </a>
      )}
    </article>
  );
}
