import connectToDB from "@utility/database";
import User from "@models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const POST = async (req, res) => {
    try {
        // Get request data
        const data = await req.json();

        // Check if request data is valid
        if (!data || !data.email) {
            return new Response(JSON.stringify({ message: "Invalid request data" }), { status: 400 });
        }

        // Destructure request data
        const { email, password, username, firstName, lastName} = data;

        // Connect to the database
        await connectToDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email: email,
            username: username,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });
        await newUser.save();

        // Generate JWT token
        const expiresIn = "3d";
        const token = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            },
            process.env.SECRET_KEY,
            { expiresIn: expiresIn }
        );
        // Return success response
        return new Response(JSON.stringify({ message: "User created successfully", token }), { status: 201 });
        
    } catch (error) {
        console.error("Error during signup:", error.message || "Internal Server Error");
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};
