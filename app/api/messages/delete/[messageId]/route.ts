import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/database";
import Message from "@/models/Messages";

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ messageId: string }> }
) => {
  const resolvedParams = await params;
  const messageId = resolvedParams.messageId;
  try {
    await connectToDb();
    const message = await Message.findByIdAndDelete(messageId);
    if (!message) {
      return NextResponse.json(
        { message: "Message not found" },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message", error);
    return NextResponse.json(
      {
        message: "Error deleting your message, try again later",
      },
      { status: 500 }
    );
  }
};
