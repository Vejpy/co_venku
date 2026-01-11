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
    []
  );

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    alert(`Submitting: ${JSON.stringify(form)}`);
    formRef.current?.reset();
    setForm({ name: "", email: "", message: "" });
  }, [form]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 bg-gray-100 shadow-2xl p-6 rounded">
      <h2 className="text-2xl font-semibold">Send a Message</h2>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <textarea
        name="message"
        placeholder="Your Message"
        onChange={handleChange}
        className="w-full p-2 border rounded h-32"
      />
      <p>Fields filled: {filledFields} / 3</p>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
}