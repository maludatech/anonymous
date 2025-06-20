import { NextResponse } from "next/server";
import User from "@/models/Users";
import PasswordResetToken from "@/models/PasswordResetTokens";
import { connectToDb } from "@/lib/database";
import crypto from "crypto";
import { sendResetEmail } from "@/lib/sendResetEmail";
import rateLimit from "next-rate-limit";

const limiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  max: 5,
});

export async function POST(request: Request) {
  const { success, limit, remaining, reset } = limiter(request);

  if (!success) {
    return NextResponse.json(
      {
        message: `Rate limit exceeded. Try again after ${new Date(reset).toLocaleTimeString()}.`,
      },
      { status: 429 }
    );
  }

  try {
    await connectToDb();
    const { email } = await request.json();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, a reset email has been sent." },
        { status: 200 }
      );
    }

    // Invalidate existing tokens
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token
    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    // Send email
    const resetUrl = `${
      process.env.NEXT_PUBLIC_APP_URL
    }/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    await sendResetEmail(email, resetUrl);

    return NextResponse.json(
      { message: "If an account exists, a reset email has been sent." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
