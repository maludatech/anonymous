import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";
import EmailVerificationToken from "@/models/EmailVerificationTokens";
import { sendVerificationEmail } from "@/lib/email";
import { resendVerificationSchema, firstIssueMessage } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const parsed = resendVerificationSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json(
        { message: firstIssueMessage(parsed.error) },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    await connectToDb();

    const genericResponse = {
      message:
        "If an account with that email exists and isn't verified yet, a new verification email has been sent.",
    };

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.emailVerified) {
      return NextResponse.json(genericResponse, { status: 200 });
    }

    await EmailVerificationToken.deleteMany({ userId: user._id });

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await EmailVerificationToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    const verifyUrl = `${
      process.env.NEXT_PUBLIC_APP_URL
    }/verify-email?token=${token}&email=${encodeURIComponent(user.email)}`;

    try {
      await sendVerificationEmail(user.email, user.username, verifyUrl);
    } catch (emailError: any) {
      console.error(
        `Failed to resend verification email to ${user.email}:`,
        emailError.message
      );
    }

    return NextResponse.json(genericResponse, { status: 200 });
  } catch (error: any) {
    console.error("Resend-verification error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
