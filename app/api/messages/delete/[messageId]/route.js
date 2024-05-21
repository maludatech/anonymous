import connectToDB from "@utility/database";
import Message from "@models/Message";

export const DELETE = async (req, { params }) => {
    const { messageId } = params;
    try {
        await connectToDB();
        const message = await Message.findByIdAndDelete(messageId);
        if (!message) {
            return new Response(JSON.stringify({ message: "Message not found" }), { status: 404 });
        }
        return new Response(JSON.stringify({ message: "Message deleted successfully" }), { status: 200 });
    } catch (error) {
        console.error("Error deleting message", error);
        return new Response(JSON.stringify({ message: "Error deleting your message, try again later" }), { status: 500 });
    }
};
