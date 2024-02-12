import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log("DB connection successful")
    } catch (error) {
        console.error("Error connecting to DB: ", error)
        process.exit(1)
    }
}

export default connectToDB