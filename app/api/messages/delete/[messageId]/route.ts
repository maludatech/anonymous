import { NextResponse, NextRequest } from "next/server";
import { connectToDb } from "@/lib/database";
import Message from "@/models/Messages";
import User from "@/models/Users";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  email: string;
  username: string;
}

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) => {
  try {
    const resolvedParams = await params;
    const messageId = resolvedParams.messageId;

    // Verify JWT token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "3VLLagDOPe6UXMSWpDkYvPh0uWzDNBsD"
      ) as JwtPayload;
    } catch (error) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    await connectToDb();

    // Find user
    const user = await User.findOne({
      username: decoded.username.toLowerCase(),
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Find and verify message ownership
    const message = await Message.findOne({
      _id: messageId,
      receiver: user.username,
    });
    if (!message) {
      return NextResponse.json(
        { message: "Message not found or you lack permission to delete it" },
        { status: 404 }
      );
    }

    // Delete message
    await Message.deleteOne({ _id: messageId });
    return NextResponse.json(
      { message: "Message deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete message. Please try again later." },
      { status: 500 }
    );
  }
};
