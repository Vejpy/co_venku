"use client";

interface User {
  name?: string;
  role?: string;
  birth?: string;
}

export default function ProfileHeader({ user }: { user: User | null }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6">
      <h1 className="text-2xl font-bold">{user?.name}</h1>
      <p>{user?.role}</p>
    </div>
  );
}