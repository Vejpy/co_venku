// /app/api/friends/send-request/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"; // your Postgres client

export async function POST(req: NextRequest) {
  const { senderUsername, receiverUsername } = await req.json();

  if (!senderUsername || !receiverUsername) {
    return NextResponse.json({ error: "Missing usernames" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const senderRes = await client.query("SELECT id FROM users WHERE username=$1", [senderUsername]);
    const receiverRes = await client.query("SELECT id FROM users WHERE username=$1", [receiverUsername]);
    if (!senderRes.rows[0] || !receiverRes.rows[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const senderId = senderRes.rows[0].id;
    const receiverId = receiverRes.rows[0].id;

    // Check if they are already friends
    const friendship = await client.query(
      "SELECT * FROM friends WHERE (user1_id=$1 AND user2_id=$2) OR (user1_id=$2 AND user2_id=$1)",
      [senderId, receiverId]
    );
    if (friendship.rows.length) {
      return NextResponse.json({ error: "Already friends" }, { status: 400 });
    }

    // Insert friend request
    await client.query(
      "INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [senderId, receiverId]
    );

    return NextResponse.json({ message: "Request sent!" });
  } finally {
    client.release();
  }
}