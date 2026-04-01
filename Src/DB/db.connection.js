import mongoose from "mongoose";
import envConfig from "../config/env.config.js";
const database=envConfig.database
const dbConnection =async()=>{
    try {
        await mongoose.connect(database.MONGO_URL)
        console.log("database connected");
    } catch (error) {
        console.log("database faild",error);
        
    }

}

export default dbConnection;