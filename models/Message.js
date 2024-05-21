import mongoose, { Schema, model, models } from "mongoose";

const messageSchema = new Schema({
  receiver: {
    type: String, 
    ref: "User"
  },
  message: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Message = models.Message || model("Message", messageSchema);

export default Message;
