import { NextResponse, NextRequest } from "next/server";
import { connectToDb } from "@/lib/database";
import Message from "@/models/Messages";
import User from "@/models/Users";
import jwt from "jsonwebtoken";
import { sendMessageSchema, firstIssueMessage } from "@/lib/validation";

interface JwtPayload {
  userId: string;
  email: string;
  username: string;
}

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  try {
    const resolvedParams = await params;
    const username = resolvedParams.username.toLowerCase();

    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    } catch (error) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    if (decoded.username.toLowerCase() !== username) {
      return NextResponse.json(
        { message: "Forbidden: You may only view your own messages" },
        { status: 403 }
      );
    }

    const limitParam = parseInt(req.nextUrl.searchParams.get("limit") || "", 10);
    const skipParam = parseInt(req.nextUrl.searchParams.get("skip") || "", 10);
    const limit = Number.isFinite(limitParam)
      ? Math.min(Math.max(limitParam, 1), 50)
      : 20;
    const skip = Number.isFinite(skipParam) ? Math.max(skipParam, 0) : 0;

    await connectToDb();
    const escapedUsername = username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = {
      receiver: { $regex: `^${escapedUsername}$`, $options: "i" },
    };

    const [messages, total] = await Promise.all([
      Message.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Message.countDocuments(filter),
    ]);

    return NextResponse.json(
      { messages, total, hasMore: skip + messages.length < total },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Fetch messages error:", error.message);
    return NextResponse.json(
      { message: "Failed to fetch messages. Please try again later." },
      { status: 500 }
    );
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  try {
    const resolvedParams = await params;
    const username = resolvedParams.username.toLowerCase();
    const body = await req.json();
    const parsed = sendMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: firstIssueMessage(parsed.error) },
        { status: 400 }
      );
    }

    const { message } = parsed.data;

    // If the sender happens to be signed in as the recipient, block it —
    // this can't be caught client-side alone since this endpoint takes no
    // required auth (anonymous senders never send a token).
    const authHeader = req.headers.get("authorization");
    const jwtSecret = process.env.JWT_SECRET;
    if (authHeader?.startsWith("Bearer ") && jwtSecret) {
      try {
        const decoded = jwt.verify(
          authHeader.split(" ")[1],
          jwtSecret
        ) as JwtPayload;
        if (decoded.username.toLowerCase() === username) {
          return NextResponse.json(
            { message: "You can't send a message to yourself." },
            { status: 400 }
          );
        }
      } catch {
        // Invalid/expired token on an otherwise-anonymous endpoint — ignore
        // and proceed as a normal anonymous sender.
      }
    }

    await connectToDb();
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    await Message.create({
      receiver: user.username,
      message,
    });

    return NextResponse.json(
      { message: "Message posted successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to post message. Please try again later." },
      { status: 500 }
    );
  }
};
