import { NextRequest, NextResponse } from "next/server";
import { readJsonFile } from "@/utils/JSONfileOperations";
import { cookies } from "next/headers";
import { UsersData } from "@/types/types";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const usersData = await readJsonFile<UsersData>("users.json")
      .then((data) => (data.users ? data : { users: [] }))
      .catch(() => ({ users: [] }));

    const user = usersData.users.find((u) => u.email === email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: "userId",
      value: user.id,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    const userWithoutPassword = { ...user } as Record<string, unknown>;
    delete userWithoutPassword.password;

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Login successful",
    });
  } catch (error) {
    console.error(
      "Login error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
