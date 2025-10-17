import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  const { username } = await req.json();
  if (!username) return NextResponse.json({ error: "Missing username" }, { status: 400 });

  const client = await pool.connect();
  try {
    const userRes = await client.query("SELECT id FROM users WHERE username=$1", [username]);
    if (!userRes.rows[0]) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userId = userRes.rows[0].id;

    // Pending requests where this user is receiver
    const pendingRes = await client.query(
      `SELECT u.username AS sender
       FROM friend_requests fr
       JOIN users u ON fr.sender_id = u.id
       WHERE fr.receiver_id=$1`,
      [userId]
    );

    // Friends list
    const friendsRes = await client.query(
      `SELECT u.username
       FROM friends f
       JOIN users u ON (u.id = f.user1_id OR u.id = f.user2_id) AND u.id != $1
       WHERE f.user1_id=$1 OR f.user2_id=$1`,
      [userId]
    );

    return NextResponse.json({
      pendingRequests: pendingRes.rows,
      friends: friendsRes.rows.map(r => r.username),
    });
  } finally {
    client.release();
  }
}