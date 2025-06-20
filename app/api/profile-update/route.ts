import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const PATCH = async (req: Request) => {
  const data = await req.json();

  const { email, password } = data;

  try {
    await connectToDb();

    // Hash and salt the new password before updating
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update the user's document in the database
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );
    // Generate a new JWT token with updated user information
    const token = jwt.sign(
      {
        userId: updatedUser._id,
        email: updatedUser.email,
        username: updatedUser.username,
      },
      process.env.SECRET_KEY,
      { expiresIn: "3d" }
    );

    return NextResponse.json(
      { message: "Profile updated successfully!!", token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating profile" },
      {
        status: 500,
      }
    );
  }
};
