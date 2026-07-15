import { NextResponse, NextRequest } from "next/server";
import User from "@/models/Users";
import { connectToDb } from "@/lib/database";
import jwt from "jsonwebtoken";
import { verify } from "@node-rs/argon2";
import { signInSchema, firstIssueMessage } from "@/lib/validation";

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();
    const parsed = signInSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json(
        { message: firstIssueMessage(parsed.error) },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    await connectToDb();
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (!existingUser) {
      return NextResponse.json({ message: "Invalid email" }, { status: 401 });
    }

    const passwordMatch = await verify(existingUser.password, password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    if (!existingUser.emailVerified) {
      return NextResponse.json(
        {
          message: "Please verify your email before signing in.",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
      },
      jwtSecret,
      { expiresIn: "3d" }
    );

    return NextResponse.json(
      {
        token,
        user: { email: existingUser.email, username: existingUser.username },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Sign-in error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
