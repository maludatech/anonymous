import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/database";
import Message from "@/models/Messages";
import User from "@/models/Users";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) => {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  try {
    await connectToDb();
    const message = await Message.find({ receiver: username });
    if (!message) {
      return NextResponse.json(
        {
          message: "Error fetching your messages, try again later",
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("Error fetching messages", error);
    return NextResponse.json(
      { message: "Error fetching your messages, try again later" },
      { status: 500 }
    );
  }
};

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) => {
  const resolvedParams = await params;
  const username = resolvedParams.username;

  const { message } = await req.json();

  try {
    await connectToDb();
    const user = await User.findOne({ username: username });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        {
          status: 404,
        }
      );
    }
    const newMessage = await Message.create({
      receiver: user.username,
      message: message,
    });

    return NextResponse.json(
      { message: "Message Posted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error posting message", error);
    return NextResponse.json(
      { message: "Error posting your message, try again later" },
      { status: 500 }
    );
  }
};
