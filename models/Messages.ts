// models/Messages.ts
import { Schema, model, models } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for anonymous messages
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [1, "Message cannot be empty"],
      maxlength: [1000, "Message must be less than 1000 characters"],
    },
    isAnonymous: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
messageSchema.index({ receiver: 1, createdAt: -1 }); // For fetching messages by receiver
messageSchema.index({ sender: 1, createdAt: -1 }); // For fetching sent messages

const Message = models.Message || model("Message", messageSchema);

export default Message;
