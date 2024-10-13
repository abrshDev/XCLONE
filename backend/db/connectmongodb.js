import mongoose from "mongoose";

export const connectdb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
    });
    console.log("connected ", conn.connection.host);
  } catch (error) {
    console.log(error.message);
  }
};
