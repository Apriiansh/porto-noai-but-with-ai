import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { user } from "@/lib/data_placeholder";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Check against placeholder user data
    const validUser = user.find(u => u.email === username && u.password === password);

    if (validUser) {
      // Set a simple auth token in cookies
      const cookieStore = await cookies();
      cookieStore.set("auth-token", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({ message: "Login successful" });
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
