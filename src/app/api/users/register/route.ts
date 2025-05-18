import { NextRequest, NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/utils/JSONfileOperations";
import crypto from "crypto";
import { User, UsersData } from "@/types/types";

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();

    if (
      !userData.name ||
      !userData.surname ||
      !userData.email ||
      !userData.password
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const usersData: UsersData = await readJsonFile<UsersData>("users.json")
      .then((data) => (data.users ? data : { users: [] }))
      .catch(() => ({ users: [] }));

    if (usersData.users.some((user) => user.email === userData.email)) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name: userData.name,
      surname: userData.surname,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString(),
    };

    usersData.users.push(newUser);
    await writeJsonFile("users.json", usersData);

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          surname: newUser.surname,
          email: newUser.email,
          createdAt: newUser.createdAt,
        },
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Registration error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
