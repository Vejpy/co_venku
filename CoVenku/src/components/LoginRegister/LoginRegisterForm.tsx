"use client";

import React, { useState } from "react";
import PasswordInput from "./PasswordInput";
import ToggleModeButton from "./ToggleModeButton";
import Message from "./Message";
import { loginUser, registerUser } from "@/services/api";

const LoginRegisterForm: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [sex, setSex] = useState<number>(0);
  const [birthDate, setBirthDate] = useState<string>("2000-01-01");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
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
        setMessage({ text: res.message || "Logged in successfully!", type: "success" });
      } else {
        const res = await registerUser({
          userName,
          password,
          email,
          sex,
          birthDate,
        });
        setMessage({ text: res.message || "Registered successfully!", type: "success" });
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setMessage({ text: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-gray-100 rounded shadow-2xl flex flex-col gap-4"
    >
      <h2 className="text-2xl font-semibold text-center">{mode === "login" ? "Login" : "Register"}</h2>

      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        className="w-full p-2 border rounded bg-white"
        required
      />

      {mode === "register" && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded bg-white"
          />
          <select
            value={sex}
            onChange={(e) => setSex(Number(e.target.value))}
            className="w-full p-2 border rounded bg-white"
          >
            <option value={0}>Male</option>
            <option value={1}>Female</option>
          </select>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full p-2 border rounded bg-white"
          />
        </>
      )}

      <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:opacity-80 transition disabled:opacity-50"
      >
        {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
      </button>

      {message && <Message text={message.text} type={message.type} />}

      <ToggleModeButton mode={mode} onToggle={handleToggleMode} />
    </form>
  );
};

export default LoginRegisterForm;