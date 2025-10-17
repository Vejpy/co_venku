import Navbar from "@/components/navbar/Navbar";
import "@/app/globals.css";
import "leaflet/dist/leaflet.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Navbar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}