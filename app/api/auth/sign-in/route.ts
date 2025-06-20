import { NextResponse } from "next/server";
import User from "@/models/Users";
import { connectToDb } from "@/lib/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const POST = async (req: Request) => {
  const data = await req.json();
  const { email, password } = data;

  try {
    await connectToDb();
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      return new Response(JSON.stringify({ message: "Invalid email" }), {
        status: 401,
      });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        {
          status: 401,
        }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
        fullName: existingUser.fullName,
        countryOfResidence: existingUser.countryOfResidence,
      },
      "your-secret-key",
      { expiresIn: "3d" }
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
};
