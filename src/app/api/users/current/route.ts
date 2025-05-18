import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJsonFile } from "@/utils/JSONfileOperations";
import { UsersData } from "@/types/types";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const usersData = await readJsonFile<UsersData>("users.json")
      .then((data) => (data.users ? data : { users: [] }))
      .catch(() => ({ users: [] }));

    const user = usersData.users.find((u) => u.id === userId);

    if (!user) {
      await cookieStore.delete("userId");
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      createdAt: user.createdAt,
    };

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error(
      "Auth check error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return NextResponse.json(
      { error: "Authentication check failed" },
      { status: 500 }
    );
  }
}
