
import { Schema, model, models } from "mongoose";

const messageSchema = new Schema(
  {
    receiver: {
      type: String,
      required: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Matches the Dashboard's query pattern: find by receiver, sorted by newest first.
messageSchema.index({ receiver: 1, createdAt: -1 });

const Message = models.Message || model("Message", messageSchema);

export default Message;
