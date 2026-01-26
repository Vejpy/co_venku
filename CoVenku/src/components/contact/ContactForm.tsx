"use client";

import { useState, useRef, useMemo, useCallback } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const formRef = useRef<HTMLFormElement>(null);

  const filledFields = useMemo(() => {
    return Object.values(form).filter(Boolean).length;
  }, [form]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Submitting: ${JSON.stringify(form)}`);
      formRef.current?.reset();
      setForm({ name: "", email: "", message: "" });
    },
    [form],
  );

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-gray-800 shadow-2xl p-6 rounded-xl border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Napište nám
      </h2>
      <input
        type="text"
        name="name"
        placeholder="Vaše jméno"
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />
      <input
        type="email"
        name="email"
        placeholder="Váš email"
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />
      <textarea
        name="message"
        placeholder="Vaše zpráva"
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-32 resize-none"
      />
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Vyplněná pole: {filledFields} / 3
      </p>
      <button
        type="submit"
        className="w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        Odeslat
      </button>
    </form>
  );
}
