import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-black p-6 sm:p-12">
      <h1 className="text-4xl sm:text-5xl font-bold mb-8">Contact Us</h1>
      <div className="grid gap-12 lg:grid-cols-2">
        <ContactInfo />
        <ContactForm />
      </div>
    </main>
  );
}