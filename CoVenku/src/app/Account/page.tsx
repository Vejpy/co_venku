"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

type StoredUser = {
  username: string;
  password: string;
};

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; password: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("loggedUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/Login_Register");
    }
  }, [router]);

  const handlePasswordChange = () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (user) {
      const updatedUser = { ...user, password: newPassword };
      setUser(updatedUser);
      sessionStorage.setItem("loggedUser", JSON.stringify(updatedUser));

      // Update localStorage record if exists
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = storedUsers.map((u: StoredUser) =>
        u.username === user.username ? updatedUser : u
      );
      localStorage.setItem("users", JSON.stringify(updatedUsers));

      setMessage("Password changed successfully!");
      setChangingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("loggedUser");
    router.push("/Login_Register");
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white p-8">
      <main className="flex flex-col items-center gap-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold tracking-tight">Account</h1>

        <div className="w-full bg-gray-100 dark:bg-neutral-900 rounded-lg p-6 shadow-md">
          <p className="mb-2">
            <span className="font-semibold">Username:</span> {user.username}
          </p>
          <div className="flex items-center mb-2">
            <span className="font-semibold mr-2">Password:</span>
            <span>{showPassword ? user.password : "•".repeat(user.password.length)}</span>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 p-1 hover:opacity-80"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="mb-4">
            <span className="font-semibold">Permissions:</span>{" "}
            {user.username === "admin" ? "admin" : "user"}
          </p>

          {changingPassword ? (
            <div className="flex flex-col gap-2">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="p-2 rounded border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-white"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-2 rounded border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-white"
              />
              <button
                onClick={handlePasswordChange}
                className="bg-black text-white dark:bg-white dark:text-black py-2 rounded hover:opacity-80 transition"
              >
                Save Password
              </button>
              <button
                onClick={() => setChangingPassword(false)}
                className="text-red-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setChangingPassword(true)}
              className="bg-gray-200 dark:bg-neutral-700 py-2 px-4 rounded hover:opacity-80 transition"
            >
              Change Password
            </button>
          )}

          {message && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{message}</p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 text-white py-2 px-6 rounded hover:opacity-80 transition"
        >
          Log Out
        </button>
      </main>

      <footer className="mt-16 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} YourSiteName. All rights reserved.
      </footer>
    </div>
  );
}