import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI

export default async function dbConnect(){
   try {
     if(!MONGODB_URI){
         throw new Error("MONGODB_URI is not defined in environment variables");
     }
     await mongoose.connect(MONGODB_URI)
   } catch (error) {
        console.error("Mongo db connection failed");
        return;
   }
}