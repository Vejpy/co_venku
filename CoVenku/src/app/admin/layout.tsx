import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { fetchCurrentUser } from "@/services/serverApi";

export const metadata: Metadata = {
  title: "Administrace | CoVenku",
  description:
    "Administrační panel pro správu uživatelů, organizací a událostí v aplikaci CoVenku.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ── Step 1: Fetch user (defensive — fetchCurrentUser never throws) ────
  let user;
  try {
    user = await fetchCurrentUser();
  } catch (error) {
    // Extra safety net — should never fire since fetchCurrentUser catches internally
    console.error(
      "Admin Guard Error: unexpected failure →",
      error instanceof Error ? error.message : error,
    );
    redirect("/Login_Register");
  }

  // ── Step 2: No user → API down or no session ─────────────────────────
  if (!user) {
    console.error(
      "Admin Guard: fetchCurrentUser returned null — API unreachable or not authenticated",
    );
    redirect("/Login_Register");
  }

  // ── Step 3: Role check (case-insensitive) ─────────────────────────────
  if (user.role?.toLowerCase() !== "admin") {
    console.error(
      `Admin Guard: User "${user.name}" (id=${user.id}) has role "${user.role}" — not admin`,
    );
    redirect("/user");
  }

  return (
    <section className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4 py-8">
        <AdminSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </section>
  );
}
