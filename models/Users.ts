import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [4, "Username must be at least 4 characters"],
      maxlength: [20, "Username must be less than 20 characters"],
      match: [/^[a-zA-Z0-9]+$/, "Username: alphanumeric characters only"],
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
