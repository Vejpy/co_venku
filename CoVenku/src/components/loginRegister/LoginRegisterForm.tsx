"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "./PasswordInput";
import ToggleModeButton from "./ToggleModeButton";
import { loginUser, registerUser } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import axios from "axios";

const LoginRegisterForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState<number>(0);
  const [birthDate, setBirthDate] = useState<string>("2000-01-01");
  const [loading, setLoading] = useState(false);

  const handleToggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setUserName("");
    setPassword("");
    setEmail("");
    setSex(0);
    setBirthDate("2000-01-01");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await loginUser({ username: userName, password });

        // Token is returned inside data as a plain string
        const token =
          typeof res.data === "string"
            ? res.data
            : ((res.data as Record<string, unknown>)?.token as
                | string
                | undefined);

        if (!token) throw new Error("Token nebyl vrácen ze serveru.");

        await login(token);
        toast.success("Přihlášení úspěšné!");
        // Immediate redirect — no setTimeout
        router.push("/user");
      } else {
        await registerUser({ userName, password, email, sex, birthDate });
        toast.success("Registrace úspěšná! Nyní se přihlaste.");
        setMode("login");
        setPassword("");
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? (err.response.data.message as string)
          : err instanceof Error
            ? err.message
            : "Něco se pokazilo, zkuste to znovu.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-8 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700 flex flex-col gap-5"
    >
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
          {mode === "login" ? "Přihlášení" : "Registrace"}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {mode === "login" ? "Vítejte zpět!" : "Vytvořte si nový účet"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Uživatelské jméno
        </label>
        <input
          type="text"
          placeholder="Zadejte uživatelské jméno"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          required
        />
      </div>

      {mode === "register" && (
        <>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="vas@email.cz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Pohlaví
            </label>
            <select
              value={sex}
              onChange={(e) => setSex(Number(e.target.value))}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value={0}>Muž</option>
              <option value={1}>Žena</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Datum narození
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Heslo
        </label>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Zadejte heslo"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Zpracovávám...
          </span>
        ) : mode === "login" ? (
          "Přihlásit se"
        ) : (
          "Vytvořit účet"
        )}
      </button>

      <ToggleModeButton mode={mode} onToggle={handleToggleMode} />
    </form>
  );
};

export default LoginRegisterForm;
