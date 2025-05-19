"use client";
import Container from "@/components/layout/Container";
import LogOutButton from "@/components/auth/LogOutButton";
import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Detail from "@/components/profile/Detail";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <Container className="items-center">
      <h2 className="text-2xl font-bold">Profile info</h2>
      <section className="flex flex-col gap-2 my-8 w-full items-center">
        <Detail value={user.name || ""} label="Name" />
        <Detail value={user.surname || ""} label="Surname" />
        <Detail value={user.email || ""} label="Email" />
      </section>
      <LogOutButton />
    </Container>
  );
}
