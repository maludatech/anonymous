import { NextResponse, NextRequest } from "next/server";
import User from "@/models/Users";
import { connectToDb } from "@/lib/database";
import jwt from "jsonwebtoken";
import { hash, verify } from "@node-rs/argon2";

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json();

    const { email, password }: { email: string; password: string } = data;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDb();
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (!existingUser) {
      return NextResponse.json({ message: "Invalid email" }, { status: 401 });
    }

    const passwordMatch = await verify(existingUser.password, password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

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
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
