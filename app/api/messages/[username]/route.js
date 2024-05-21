import connectToDB from "@utility/database";
import Message from "@models/Message";
import User from "@models/User";

export const GET = async(req, {params}) => {
    const username = params.username;
    try{
        await connectToDB();
        const message = await Message.find({receiver: username});
        if(!message){
            console.error("Error fetching message", error);
            return new Response({message: "Error fetching your messages, try again later"}, {status: 404})
        }
        return new Response(JSON.stringify(message),{status: 200});
    }catch(error){
        console.error("Error fetching messages", error);
        return new Response({message: "Error fetching your messages, try again later"}, {status: 500})
    }
}

export const POST = async(req, {params}) => {
    const username = params.username;
    const {message} = await req.json();
    
    try{
        await connectToDB();
        const user = await User.findOne({username: username});

        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }),{ status: 404});
        }
        const newMessage = await Message.create({receiver: user.username, message: message});

        return new Response(JSON.stringify({ message: "Message Posted Successfully" }),{ status: 200});

    }catch(error){
        console.error("Error posting message", error);
        return new Response({message: "Error posting your message, try again later"}, {status: 500})
    }
}