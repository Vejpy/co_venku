import Image from "next/image";
import { Source } from "@/types/source";

interface SourceItemProps {
  item: Source;
}

export default function SourceItemComponent({ item }: SourceItemProps) {
  return (
    <article className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition flex flex-col">
      <h2 className="text-xl font-semibold mb-2">{item.name}</h2>

      <p className="text-gray-700 dark:text-gray-300 mb-3">
        {item.description}
      </p>

      {item.imageUrl && (
        <div className="flex justify-center mb-3">
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={200}
            height={200}
            className="rounded object-contain"
          />
        </div>
      )}

      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline mt-auto"
        >
          Visit
        </a>
      )}
    </article>
  );
}