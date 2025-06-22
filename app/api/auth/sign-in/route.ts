import { NextResponse, NextRequest } from "next/server";
import User from "@/models/Users";
import { connectToDb } from "@/lib/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();
    const { email, password } = data;

    console.log("password:", password);

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDb();
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (!existingUser) {
      console.log(`No user found for email: ${email.toLowerCase()}`);
      return NextResponse.json({ message: "Invalid email" }, { status: 401 });
    }

    console.log(`Comparing password for user: ${existingUser.email}`);
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    console.log("existing password: ", existingUser.password);

    if (!passwordMatch) {
      console.log(`Password mismatch for user: ${existingUser.email}`);
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
      },
      process.env.JWT_SECRET || "3VLLagDOPe6UXMSWpDkYvPh0uWzDNBsD",
      { expiresIn: "3d" }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error: any) {
    console.error("Error during sign-in:", error.message);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
