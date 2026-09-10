import { NextResponse, NextRequest } from "next/server";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";

export const GET = async (request: NextRequest) => {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    throw new Error("CRON_SECRET is not configured");
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDb();
    const count = await User.countDocuments();

    return NextResponse.json(
      { ok: true, ts: new Date().toISOString(), reachable: true, userCount: count },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Keepalive error:", error.message);
    return NextResponse.json(
      { ok: false, ts: new Date().toISOString(), reachable: false },
      { status: 500 }
    );
  }
};
