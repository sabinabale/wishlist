"use client";
import Container from "@/components/layout/Container";
import LogOutButton from "@/components/auth/LogOutButton";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import Detail from "@/components/profile/Detail";

export default function Page() {
  const { user } = useAuth();

  return (
    <Container className="items-center">
      <h2 className="text-2xl font-bold">Profile info</h2>
      <section className="flex flex-col gap-2 my-8 w-full items-center">
        <Detail value={user?.name || ""} label="Name" />
        <Detail value={user?.surname || ""} label="Surname" />
        <Detail value={user?.email || ""} label="Email" />
      </section>
      <LogOutButton />
    </Container>
  );
}
