import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDb } from "@/lib/database";
import User from "@/models/Users";

export const POST = async (req: Request) => {
  try {
    const data = await req.json();

    if (!data) {
      return new Response(JSON.stringify({ message: "Invalid request data" }), {
        status: 400,
      });
    }

    const { email, password, username } = data;

    await connectToDb();

    const existingUser = await User.findOne({
      email: email,
      username: username,
    });

    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email,
      username: username,
      password: hashedPassword,
    });
    await newUser.save();

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
};
