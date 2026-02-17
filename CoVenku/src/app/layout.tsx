import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import HomePageLogo from "@/components/navbar/HomePage";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Metadata } from "next";
import "@/app/globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://covenku.cz"),
  applicationName: "CoVenku",
  alternates: {
    canonical: "/",
  },
  category: "events",
  title: "CoVenku – Akce a aktivity ve tvém okolí",
  description:
    "CoVenku pomáhá najít zajímavé akce, místa a aktivity ve tvém okolí. Objevuj, plánuj a choď ven.",
  authors: [{ name: "CoVenku Team" }],
  creator: "CoVenku Team",
  publisher: "CoVenku",
  keywords: [
    "CoVenku",
    "akce v okolí",
    "co dělat venku",
    "události Česko",
    "volný čas",
    "aktivity venku",
    "mapa akcí",
    "lokální akce",
    "outdoor aktivity",
    "kam jít dnes",
    "Hradec Králové",
  ],
  openGraph: {
    title: "CoVenku",
    description:
      "Webová aplikace kde najdete všechny aktivity a akce v Hradci Králové",
    url: "https://covenku.cz",
    siteName: "CoVenku",
    locale: "cs_CZ",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CoVenku – Akce a aktivity ve tvém okolí",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoVenku",
    description:
      "Webová aplikace kde najdete všechny aktivity a akce v Hradci Králové",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

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
