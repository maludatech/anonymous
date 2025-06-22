
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

const Message = models.Message || model("Message", messageSchema);

export default Message;
