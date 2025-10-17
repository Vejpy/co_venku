"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login_Register() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, mode: isLogin ? "login" : "register" }),
    });
    const data = await res.json();

    if (data.success) {
      if (isLogin) {
        sessionStorage.setItem("loggedUser", JSON.stringify(data.user));
        router.push("/Account");
      } else {
        setMessage("Account created! You can now log in.");
        setIsLogin(true);
      }
    } else {
      setMessage(data.message || "Error occurred.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl mb-6">{isLogin ? "Login" : "Register"}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm bg-gray-100 dark:bg-neutral-900 p-6 rounded-lg shadow-md">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="p-2 rounded bg-neutral-800 text-white" />
        <div className="relative flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded bg-neutral-800 text-white w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 text-white"
            tabIndex={-1}
          >
            👁
          </button>
        </div>
        <button type="submit" className="bg-black text-white py-2 rounded hover:opacity-80">{isLogin ? "Login" : "Register"}</button>
      </form>
      {message && <p className="mt-4 text-sm text-gray-400">{message}</p>}
      <button onClick={() => setIsLogin(!isLogin)} className="mt-6 text-blue-400 hover:underline">
        {isLogin ? "Don’t have an account? → Register" : "Already have an account? → Log in"}
      </button>
    </div>
  );
}