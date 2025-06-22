import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";
import { hash } from "@node-rs/argon2";
import jwt from "jsonwebtoken";

export const PATCH = async (req: Request) => {
  try {
    const data = await req.json();
    const { email, password }: { email: string; password?: string } = data;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectToDb();

    const user = await User.findOne({ email: email.toLowerCase() });
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

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
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
    const token = jwt.sign(
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
      { message: "Profile updated successfully", token },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
