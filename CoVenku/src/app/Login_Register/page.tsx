import LoginRegisterForm from "@/components/loginRegister/LoginRegisterForm";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login a Registrace | CoVenku",
  description:
    "Přihlaš se nebo vytvoř účet pro přístup ke všem funkcím CoVenku.",
  openGraph: {
    title: "Login a Registrace | CoVenku",
    description:
      "Přihlaš se nebo vytvoř účet pro přístup ke všem funkcím CoVenku.",
    url: "https://co-venku.vercel.app/Login_Register",
    siteName: "CoVenku",
    locale: "cs_CZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Login a Registrace | CoVenku",
    description:
      "Přihlaš se nebo vytvoř účet pro přístup ke všem funkcím CoVenku.",
  },
  alternates: { canonical: "/Login_Register" },
};

export default function Login_Register() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Vítejte v CoVenku
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Objevujte kulturní místa a události ve vašem okolí
          </p>
        </div>
        <LoginRegisterForm />
      </div>
    </div>
  );
}
