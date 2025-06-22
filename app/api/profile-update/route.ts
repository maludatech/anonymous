import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";
import { hash } from "@node-rs/argon2";
import jwt from "jsonwebtoken";
import { verify } from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
  username: string;
}

export const PATCH = async (req: NextRequest) => {
  try {
    // Extract and verify the JWT token from the Authorization header
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
      decoded = verify(
        token,
        process.env.JWT_SECRET || "3VLLagDOPe6UXMSWpDkYvPh0uWzDNBsD"
      ) as TokenPayload;
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const { password }: { password?: string } = await req.json();

    await connectToDb();

    // Find the user by email from the decoded token
    const user = await User.findOne({ email: decoded.email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const updateFields: { password?: string } = {};
    if (password) {
      const hashedPassword = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });
      updateFields.password = hashedPassword;
    }

    // Update the user
    const updatedUser = await User.findOneAndUpdate(
      { email: decoded.email.toLowerCase() },
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "Failed to update profile" },
        { status: 500 }
      );
    }

    // Generate a new JWT token
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
    console.error("Error updating profile:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
