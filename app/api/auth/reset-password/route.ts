import { NextResponse } from "next/server";
import User from "@/models/Users";
import PasswordResetToken from "@/models/PasswordResetTokens";
import { connectToDb } from "@/lib/database";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectToDb();
    const { email, token, password } = await request.json();
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
      return NextResponse.json(
        { message: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    // Update password
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    // Invalidate token
    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
