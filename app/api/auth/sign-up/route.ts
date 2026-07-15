import { NextResponse, NextRequest } from "next/server";
import { hash } from "@node-rs/argon2";
import crypto from "crypto";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";
import EmailVerificationToken from "@/models/EmailVerificationTokens";
import { sendVerificationEmail } from "@/lib/email";
import { signUpSchema, firstIssueMessage } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const parsed = signUpSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json(
        { message: firstIssueMessage(parsed.error) },
        { status: 400 }
      );
    }

    const { email, password, username } = parsed.data;

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
      emailVerified: false,
    });
    await newUser.save();

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await EmailVerificationToken.create({
      userId: newUser._id,
      tokenHash,
      expiresAt,
    });

    const verifyUrl = `${
      process.env.NEXT_PUBLIC_APP_URL
    }/verify-email?token=${token}&email=${encodeURIComponent(newUser.email)}`;

    try {
      await sendVerificationEmail(newUser.email, newUser.username, verifyUrl);
    } catch (emailError: any) {
      console.error(
        `Failed to send verification email to ${newUser.email}:`,
        emailError.message
      );
    }

    return NextResponse.json(
      {
        message:
          "Account created. Check your email to verify your account before signing in.",
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
