import ModerationClient from "@/components/admin/ModerationClient";

export default function ModerationPage() {
  return (
    <article>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Moderace</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Blokování uživatelů a organizací.
        </p>
      </header>

      <ModerationClient />
    </article>
  );
}
