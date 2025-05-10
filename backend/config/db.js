import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async() =>{
    try{
        const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB: ${conn.connection.host}`)

    } catch(error){
        console.error(`MongoDB Error: ${error.message}`);
        process.exit(1) // 1 means error 0 means success
    }
}