import mongoose from "mongoose";

let isConnected = false;
export const connectToDb = async (): Promise<void> => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI as string;

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined.");
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
