import { Source } from "@/types/source";
import { sources as sourceData } from "@/data/sourceData";
import ScrollButton from "@/components/source/ScrollButton";
import SourceItemComponent from "@/components/source/SourceItem";

export default async function SourcePage() {
  const sources: Source[] = sourceData;
  const totalSources = sources.length;

  return (
    <div className="min-h-screen flex flex-col p-4 mt-10 sm:p-8 bg-background text-foreground transition-colors duration-200">
      <header className="mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
          Zdroje projektu
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Celkem použitých zdrojů: {totalSources}
        </p>

        <ScrollButton targetId="source-list">Přejít na seznam</ScrollButton>
      </header>

      <main>
        <section
          id="source-list"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch auto-rows-fr"
        >
          {sources.map((source) => (
            <SourceItemComponent key={source.id} item={source} />
          ))}
        </section>
      </main>
    </div>
  );
}
