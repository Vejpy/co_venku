"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

type StoredUser = {
  username: string;
  password: string;
};

type PendingRequest = {
  sender: string;
  id: number;
};

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string; password: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Friend system states
  const [friendUsername, setFriendUsername] = useState("");
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [requestMessage, setRequestMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("loggedUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/Login_Register");
    }
  }, [router]);

  const fetchFriendsAndRequests = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/friends/list", {
        method: "POST",
        body: JSON.stringify({ username: user.username }),
      });
      const data = await res.json();
      setPendingRequests(data.pendingRequests || []);
      setFriends(data.friends || []);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    fetchFriendsAndRequests();
  }, [fetchFriendsAndRequests]);

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

  const sendFriendRequest = async () => {
    if (!friendUsername || !user) return;
    try {
      const res = await fetch("/api/friends/send-request", {
        method: "POST",
        body: JSON.stringify({ senderUsername: user.username, receiverUsername: friendUsername }),
      });
      const data = await res.json();
      if (data.message) {
        setRequestMessage({ text: data.message, type: "success" });
      } else if (data.error) {
        setRequestMessage({ text: data.error, type: "error" });
      }
      setFriendUsername("");
      fetchFriendsAndRequests();
      // Clear message after 3 seconds
      setTimeout(() => setRequestMessage(null), 3000);
    } catch (err) {
      setRequestMessage({ text: "Network error", type: "error" });
      console.error(err);
      // Clear message after 3 seconds
      setTimeout(() => setRequestMessage(null), 3000);
    }
  };

  const acceptRequest = async (sender: string) => {
    try {
      await fetch("/api/friends/accept-request", {
        method: "POST",
        body: JSON.stringify({ senderUsername: sender, receiverUsername: user?.username }),
      });
      fetchFriendsAndRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const declineRequest = async (sender: string) => {
    try {
      await fetch("/api/friends/decline-request", {
        method: "POST",
        body: JSON.stringify({ senderUsername: sender, receiverUsername: user?.username }),
      });
      fetchFriendsAndRequests();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-black text-black dark:text-white p-8">
      <main className="flex flex-col items-center gap-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold pt-15 tracking-tight">Account</h1>

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

        {/* Friend System Section */}
        <div className="w-full bg-gray-50 dark:bg-neutral-900 rounded-lg p-6 shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-2">Friends</h2>
          <div className="flex gap-2 mb-2">
            <input
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
              placeholder="Enter username"
              className="border p-2 rounded flex-1 bg-white dark:bg-neutral-800 text-black dark:text-white"
            />
            <button
              onClick={sendFriendRequest}
              className="bg-blue-500 text-white px-4 rounded hover:opacity-80 transition"
            >
              Send Request
            </button>
          </div>

          {/* Visual feedback for friend request */}
          {requestMessage && (
            <p
              className={`mb-2 text-sm ${
                requestMessage.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {requestMessage.text}
            </p>
          )}

          <div>
            <h3 className="font-semibold mb-1">Pending Requests</h3>
            {pendingRequests.length ? (
              pendingRequests.map((r) => (
                <div key={r.sender} className="flex justify-between items-center p-2 border-b">
                  <span>{r.sender}</span>
                  <div>
                    <button
                      onClick={() => acceptRequest(r.sender)}
                      className="bg-green-500 text-white px-2 rounded mr-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => declineRequest(r.sender)}
                      className="bg-red-500 text-white px-2 rounded"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No pending requests</p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-1">Friends List</h3>
            {friends.length ? (
              friends.map((f) => <p key={f}>{f}</p>)
            ) : (
              <p className="text-gray-500">No friends yet</p>
            )}
          </div>
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