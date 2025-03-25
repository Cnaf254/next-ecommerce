import mongoose from "mongoose";

export async function mongooseConnect() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error(" MongoDB URI is not defined in environment variables.");
    }

    if (mongoose.connection.readyState === 1) {
        console.log("Already connected to MongoDB.");
        return mongoose.connection.asPromise();
    }

    if (mongoose.connection.readyState === 2) {
        console.log("MongoDB connection is in progress...");
        return mongoose.connection.asPromise();
    }

    try {
        console.log(" Connecting to MongoDB...");
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Successfully connected to MongoDB.");
    } catch (error) {
        console.error(" MongoDB connection error:", error);
        throw error;
    }
}
