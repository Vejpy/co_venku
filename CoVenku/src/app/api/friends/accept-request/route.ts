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

    const senderId = senderRes.rows[0].id;
    const receiverId = receiverRes.rows[0].id;

    // Insert into friends table
    const [user1, user2] = senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];
    await client.query(
      "INSERT INTO friends (user1_id, user2_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [user1, user2]
    );

    // Remove friend request
    await client.query(
      "DELETE FROM friend_requests WHERE sender_id=$1 AND receiver_id=$2",
      [senderId, receiverId]
    );

    return NextResponse.json({ message: "Friend request accepted!" });
  } finally {
    client.release();
  }
}