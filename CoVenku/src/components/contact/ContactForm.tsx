"use client";

import { useState, useRef, useMemo, useCallback } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [emailValid, setEmailValid] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const filledFields = useMemo(() => {
    return Object.values(form).filter(Boolean).length;
  }, [form]);

  const validateEmail = useCallback((email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (name === "email") {
        setEmailValid(validateEmail(value));
      }
    },
    [validateEmail],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateEmail(form.email)) {
        setEmailValid(false);
        alert("Neplatný email!");
        return;
      }

      alert(`Submitting: ${JSON.stringify(form)}`);
      formRef.current?.reset();
      setForm({ name: "", email: "", message: "" });
      setEmailValid(true);
    },
    [form, validateEmail],
  );

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 bg-white dark:bg-zinc-800 shadow-2xl p-6 rounded-xl border border-zinc-200 dark:border-zinc-700"
    >
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Napište nám
      </h2>
      <input
        type="text"
        name="name"
        placeholder="Vaše jméno"
        onChange={handleChange}
        className="w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />
      <input
        type="email"
        name="email"
        placeholder="Váš email"
        onChange={handleChange}
        className={`w-full p-3 border rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:ring-2 focus:border-transparent transition-all ${
          emailValid
            ? "border-zinc-300 dark:border-zinc-600 focus:ring-primary"
            : "border-red-500 focus:ring-red-500"
        }`}
      />
      {!emailValid && (
        <p className="text-red-500 text-sm">Prosím zadejte platný email</p>
      )}
      <textarea
        name="message"
        placeholder="Vaše zpráva"
        onChange={handleChange}
        className="w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all h-32 resize-none"
      />
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
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
