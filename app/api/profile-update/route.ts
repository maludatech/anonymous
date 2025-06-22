import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";
import { hash, verify as verifyPassword } from "@node-rs/argon2";
import jwt, { verify as verifyToken } from "jsonwebtoken";

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
    let decoded: TokenPayload;
    try {
      decoded = verifyToken(
        token,
        process.env.JWT_SECRET || "3VLLagDOPe6UXMSWpDkYvPh0uWzDNBsD"
      ) as TokenPayload;
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const {
      oldPassword,
      newPassword,
    }: { oldPassword: string; newPassword: string } = await req.json();

    // Validate input
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Current and new passwords are required" },
        { status: 400 }
      );
    }

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
    const hashedPassword = await hash(newPassword, {
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
        fullName: updatedUser.fullName,
        countryOfResidence: updatedUser.countryOfResidence,
      },
      process.env.JWT_SECRET || "3VLLagDOPe6UXMSWpDkYvPh0uWzDNBsD",
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
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
