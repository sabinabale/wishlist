// components/LogoutButton.tsx
"use client";

import { Button } from "../ui/Button";
import LogOutIcon from "../icons/LogOutIcon";
import { useAuth } from "@/context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
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
