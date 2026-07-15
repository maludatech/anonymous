import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";
import { hash, verify as verifyPassword } from "@node-rs/argon2";
import jwt, { verify as verifyToken } from "jsonwebtoken";
import { profileUpdateSchema, firstIssueMessage } from "@/lib/validation";

interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

export const PATCH = async (req: NextRequest) => {
  try {
    // Extract and verify the JWT token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Authorization token is required" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    let decoded: TokenPayload;
    try {
      decoded = verifyToken(token, jwtSecret) as TokenPayload;
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = profileUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: firstIssueMessage(parsed.error) },
        { status: 400 }
      );
    }

    const { oldPassword, newPassword } = parsed.data;

    await connectToDb();

    // Find user by email from token
    const user = await User.findOne({ email: decoded.email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Verify old password
    const isOldPasswordValid = await verifyPassword(user.password, oldPassword);
    if (!isOldPasswordValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Check if new password is different from old password
    const isSamePassword = await verifyPassword(user.password, newPassword);
    if (isSamePassword) {
      return NextResponse.json(
        { message: "New password must be different from the current password" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(newPassword.trim(), {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // Update user
    const updatedUser = await User.findOneAndUpdate(
      { email: decoded.email.toLowerCase() },
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "Failed to update profile" },
        { status: 500 }
      );
    }

    // Generate new JWT token
    const newToken = jwt.sign(
      {
        userId: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
      },
      jwtSecret,
      { expiresIn: "3d" }
    );

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        token: newToken,
        user: {
          email: updatedUser.email,
          username: updatedUser.username,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Profile-update error:", error.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
