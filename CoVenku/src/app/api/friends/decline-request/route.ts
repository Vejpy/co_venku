import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const { senderUsername, receiverUsername } = await req.json();
  if (!senderUsername || !receiverUsername)
    return NextResponse.json({ error: "Missing usernames" }, { status: 400 });

  const client = await pool.connect();
  try {
    const senderRes = await client.query("SELECT id FROM users WHERE username=$1", [senderUsername]);
    const receiverRes = await client.query("SELECT id FROM users WHERE username=$1", [receiverUsername]);
    if (!senderRes.rows[0] || !receiverRes.rows[0])
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Remove friend request
    await client.query(
      "DELETE FROM friend_requests WHERE sender_id=$1 AND receiver_id=$2",
      [senderRes.rows[0].id, receiverRes.rows[0].id]
    );

    return NextResponse.json({ message: "Friend request declined!" });
  } finally {
    client.release();
  }
}