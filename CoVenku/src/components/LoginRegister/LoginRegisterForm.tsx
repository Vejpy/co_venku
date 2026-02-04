"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "./PasswordInput";
import ToggleModeButton from "./ToggleModeButton";
import Message from "./Message";
import { loginUser, registerUser } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const LoginRegisterForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState<number>(0);
  const [birthDate, setBirthDate] = useState<string>("2000-01-01");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setMessage(null);
    setUserName("");
    setPassword("");
    setEmail("");
    setSex(0);
    setBirthDate("2000-01-01");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "login") {
        const res = await loginUser({ username: userName, password });
        console.log("Login response:", res);
        // Store the token and load user data
        // API returns token directly in data as string
        let token = null;
        if (typeof res.data === "string") {
          token = res.data; // Token je přímo v data jako string
        } else if (res.data?.token) {
          token = res.data.token;
        } else if (res.token) {
          token = res.token;
        }

        if (token) {
          await login(token);
          setMessage({
            text: res.message || "Přihlášení úspěšné!",
            type: "success",
          });
          // Redirect to user page after successful login
          setTimeout(() => {
            router.push("/user");
          }, 800);
        } else {
          throw new Error("Token nebyl vrácen z API");
        }
      } else {
        const res = await registerUser({
          userName,
          password,
          email,
          sex,
          birthDate,
        });
        setMessage({
          text: res.message || "Registrace úspěšná! Nyní se můžete přihlásit.",
          type: "success",
        });
        // Switch to login mode after successful registration
        setTimeout(() => {
          setMode("login");
          setPassword("");
        }, 1500);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Nastala chyba";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-5"
    >
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {mode === "login" ? "Přihlášení" : "Registrace"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {mode === "login" ? "Vítejte zpět!" : "Vytvořte si nový účet"}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Uživatelské jméno
        </label>
        <input
          type="text"
          placeholder="Zadejte uživatelské jméno"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          required
        />
      </div>

      {mode === "register" && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="vas@email.cz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Pohlaví
            </label>
            <select
              value={sex}
              onChange={(e) => setSex(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option value={0}>Muž</option>
              <option value={1}>Žena</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Datum narození
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              required
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

      {message && <Message text={message.text} type={message.type} />}

      <ToggleModeButton mode={mode} onToggle={handleToggleMode} />
    </form>
  );
};

export default LoginRegisterForm;
