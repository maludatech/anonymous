import { NextResponse, NextRequest } from "next/server";
import { connectToDb } from "@/lib/database";
import Message from "@/models/Messages";
import User from "@/models/Users";
import jwt from "jsonwebtoken";

interface PostBody {
  message: string;
}

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

    await connectToDb();
    const messages = await Message.find({ receiver: username }).sort({
      createdAt: -1,
    });

    return NextResponse.json(messages, { status: 200 });
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
    const { message }: PostBody = await req.json();

    // Validate message
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { message: "Message is required and cannot be empty." },
        { status: 400 }
      );
    }
    if (message.length > 500) {
      return NextResponse.json(
        { message: "Message cannot exceed 500 characters." },
        { status: 400 }
      );
    }

    await connectToDb();
    const user = await User.findOne({ username });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const newMessage = await Message.create({
      receiver: user.username,
      message: message.trim(),
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
