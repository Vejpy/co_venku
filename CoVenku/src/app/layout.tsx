import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import HomePageLogo from "@/components/navbar/HomePage";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import "@/app/globals.css";
import "leaflet/dist/leaflet.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />

            <main className="px-6 sm:px-12 py-8">
              <SpeedInsights />
              <HomePageLogo />
              <div className="pt-0">{children}</div>
            </main>

            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
