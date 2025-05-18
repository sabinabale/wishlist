// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import LogOutIcon from "../icons/LogOutIcon";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Button variant="destructive" onClick={handleLogout}>
      <LogOutIcon />
      Logout
    </Button>
  );
}
