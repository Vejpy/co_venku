import type { Metadata } from "next";
import LoginRegisterForm from "@/components/loginRegister/LoginRegisterForm";

export const metadata: Metadata = {
  metadataBase: new URL("https://covenku.cz"),
  applicationName: "CoVenku",
  alternates: {
    canonical: "/Login_Register",
  },
  category: "events",
  title: "Přihlášení | CoVenku – Akce a aktivity ve tvém okolí",
  description:
    "Přihlas se do CoVenku a objevuj akce, kulturní místa a aktivity ve svém okolí. Najdi co dělat venku ještě dnes.",
  authors: [{ name: "CoVenku Team" }],
  creator: "CoVenku Team",
  publisher: "CoVenku",
  keywords: [
    "CoVenku",
    "přihlášení",
    "registrace",
    "akce v okolí",
    "co dělat venku",
    "události Česko",
    "volný čas",
    "aktivity venku",
    "Hradec Králové",
  ],
  openGraph: {
    title: "Přihlášení – CoVenku",
    description:
      "Přihlas se do aplikace CoVenku a objevuj akce a aktivity ve svém okolí.",
    url: "https://covenku.cz/Login_Register",
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
  robots: {
    index: true,
    follow: true,
  },
};

export default function Login_Register() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Vítejte v CoVenku
          </h1>

          <h2 className="text-base font-normal text-gray-500 dark:text-gray-400">
            Objevujte kulturní místa, události a aktivity ve vašem okolí
          </h2>
        </div>

        <LoginRegisterForm />
      </div>
    </div>
  );
}
