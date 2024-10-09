import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectroute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({ error: "Unauthorized: no token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({ error: "Unauthorized: invalid token" });
    }
    const user = await User.findById(decoded.userid).select("-password");
    req.user = user;
    next();
  } catch (error) {
    console.log("error in protectroute", error.message);
    return res.status(500).json("server error");
  }
};
