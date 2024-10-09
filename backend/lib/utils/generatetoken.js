import mongoose from "mongoose";
import jwt from "jsonwebtoken";
export const generatetokenandsetcookie = async (userid, res) => {
  const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  return res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //ms,
    httpOnly: true, //prevent xss attacks  cross-site  scripting attacks
    sameSite: "strict", //csrf attacks cross-site
    secure: process.env.NODE_ENV !== "development",
  });
};
