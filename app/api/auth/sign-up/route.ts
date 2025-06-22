import { NextResponse, NextRequest } from "next/server";
import { hash } from "@node-rs/argon2";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, password, username } = data;

    if (!email || !password || !username) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

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

    const hashedPassword = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const newUser = new User({
      email: email.toLowerCase(),
      username: username.toLowerCase(),
      password: hashedPassword,
    });
    await newUser.save();

    try {
      await sendWelcomeEmail(email, username);
    } catch (emailError: any) {
      console.error(
        `Failed to send welcome email to ${email}:`,
        emailError.message
      );
    }

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: { email: newUser.email, username: newUser.username },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Sign-up error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
