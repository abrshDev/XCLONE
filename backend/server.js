import express from "express";
import authroutes from "./routes/auth.route.js";
import userroutes from "./routes/user.route.js";
import notifficationroutes from "./routes/notiffication.route.js";
import postroutes from "./routes/post.route.js";
import { connectdb } from "./db/connectmongodb.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true, // If you're using cookies for auth, include this
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUND_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use("/api/auth", authroutes);
app.use("/api/user", userroutes);
app.use("/api/post", postroutes);
app.use("/api/notiffication", notifficationroutes);

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
  connectdb();
});
