import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async() => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log("Already connected to MongoDB");
    }
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log("Connected to MongoDB");
    }catch(err){
        console.log("MongoDb not connected", err)
    }
};

export default connectToDB;