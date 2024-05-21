import connectToDB from "@utility/database";
import User from "@models/User";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";

export const PATCH = async(req,res)=> {
    
    const data = await req.json();

    const {email,firstName,lastName, password} = data;

    try{
        await connectToDB();
        
        // Hash and salt the new password before updating
        const hashedPassword = await bcrypt.hash(password, 10);
         // Update the user's document in the database
        const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { firstName,lastName, password: hashedPassword },
        { new: true }
      );
      // Generate a new JWT token with updated user information
      const token = jwt.sign(
        {
            userId: updatedUser._id,
            email: updatedUser.email,
            username: updatedUser.username,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName
        },
        process.env.SECRET_KEY,
        { expiresIn: "3d" }
        );

        return new Response(JSON.stringify({message: "Profile updated successfully!!", token}), {status: 200});
    }catch(error){
        console.error("Error during profile update",error);
        return new Response(JSON.stringify({message: "Error Updating Profile"}), {status: 500});
    }
};