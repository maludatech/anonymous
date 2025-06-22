import { NextResponse } from "next/server";
import User from "@/models/Users";
import PasswordResetToken from "@/models/PasswordResetTokens";
import { connectToDb } from "@/lib/database";
import crypto from "crypto";
import { hash } from "@node-rs/argon2";

export async function POST(request: Request) {
  try {
    await connectToDb();
    const { email, token, password } = await request.json();

    if (!email || !token || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid reset link" },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetToken = await PasswordResetToken.findOne({
      userId: user._id,
      tokenHash,
      expiresAt: { $gt: new Date() },
    });

    if (!resetToken) {
      console.log(`Invalid or expired token for user: ${email.toLowerCase()}`);
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    // Update password
    user.password = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    await user.save();

    // Invalidate token
    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
