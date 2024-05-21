import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email must be unique"]
  },
  password:{
    type: String,
    required: [true, "password is required"],
  },
  username:{
    type: String,
    required: [true, "Username is required"],
    unique: [true, "Username must be unique"]
  },
  firstName:{
    type: String,
    required: [true, "First name is required"]
  },
  lastName:{
    type: String,
    required: [true, "Last name is required"]
  }
}, { timestamps: true });

const User = models.User || model("User", userSchema);

export default User;
