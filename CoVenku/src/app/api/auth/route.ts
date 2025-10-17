import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  const { username, password, mode } = await request.json();
  const client = await pool.connect();

  try {
    if (mode === "login") {
      const res = await client.query(
        "SELECT * FROM users WHERE username=$1 AND password=$2",
        [username.toLowerCase(), password]
      );
      if (res.rows.length > 0) {
        return NextResponse.json({ success: true, user: res.rows[0] });
      } else {
        return NextResponse.json({ success: false, message: "Invalid credentials." });
      }
    } else if (mode === "register") {
      const exists = await client.query("SELECT * FROM users WHERE username=$1", [username.toLowerCase()]);
      if (exists.rows.length > 0) {
        return NextResponse.json({ success: false, message: "Username already exists." });
      }
      await client.query(
        "INSERT INTO users (username, password, permission) VALUES ($1, $2, FALSE)",
        [username.toLowerCase(), password]
      );
      return NextResponse.json({ success: true, message: "Account created." });
    }
  } finally {
    client.release();
  }
}