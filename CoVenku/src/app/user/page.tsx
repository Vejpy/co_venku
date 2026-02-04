import { Suspense } from "react";
import UserClient from "@/components/user/UserClient";

export default function UserPage() {
  return (
    <Suspense fallback={<div className="pt-20 text-center">Načítání profilu...</div>}>
      <UserClient />
    </Suspense>
  );
}