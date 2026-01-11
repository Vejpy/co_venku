import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import HomePageLogo from "@/components/navbar/HomePage";
import "@/app/globals.css";
import "leaflet/dist/leaflet.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen">
        <Navbar />

        <main className="px-6 sm:px-12 py-8">
          <HomePageLogo />
          <div className="pt-0">{children}</div>
        </main>

        <Footer />
      </body>
    </html>
  );
}