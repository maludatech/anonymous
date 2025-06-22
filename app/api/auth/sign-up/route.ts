import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 }
      );
    }

    const { email, password, username } = data;

    await connectToDb();

    const existingUser = await User.findOne({
      username: username.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Username already exists, please choose another one" },
        { status: 400 }
      );
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });

    if (existingEmail) {
      return NextResponse.json(
        { message: "Email already exists, please sign in" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
    });
    await newUser.save();

    // Send welcome email
    await sendWelcomeEmail(email, username);

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: { email: newUser.email, username: newUser.username },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Sign-up error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
