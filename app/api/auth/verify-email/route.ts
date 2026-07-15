import { NextResponse, NextRequest } from "next/server";
import crypto from "crypto";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";
import EmailVerificationToken from "@/models/EmailVerificationTokens";
import { sendWelcomeEmail } from "@/lib/email";
import { verifyEmailSchema, firstIssueMessage } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const parsed = verifyEmailSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json(
        { message: firstIssueMessage(parsed.error) },
        { status: 400 }
      );
    }

    const { email, token } = parsed.data;

    await connectToDb();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid verification link" },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified. You can sign in." },
        { status: 200 }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const verificationToken = await EmailVerificationToken.findOne({
      userId: user._id,
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { message: "Invalid or expired verification link" },
        { status: 400 }
      );
    }

    user.emailVerified = true;
    await user.save();

    await EmailVerificationToken.deleteMany({ userId: user._id });

    try {
      await sendWelcomeEmail(user.email, user.username);
    } catch (emailError: any) {
      console.error(
        `Failed to send welcome email to ${user.email}:`,
        emailError.message
      );
    }

    return NextResponse.json(
      { message: "Email verified successfully. You can now sign in." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Verify-email error:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
