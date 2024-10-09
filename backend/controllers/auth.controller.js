import { generatetokenandsetcookie } from "../lib/utils/generatetoken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  try {
    const { username, email, password, fullname } = req.body;
    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailregex.test(email)) {
      return res.status(400).json({ error: "Invalid Email Format" });
    }
    const isuserexit = await User.findOne({ username });
    if (isuserexit) {
      return res.status(400).json({ error: "user already exists" });
    }
    const isemaliexit = await User.findOne({ email });
    if (isemaliexit) {
      return res.status(400).json({ error: "email already exit" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "password length cannot be less than 6" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(password, salt);
    const newuser = new User({ username, email, fullname, password: hashpass });
    if (newuser) {
      generatetokenandsetcookie(newuser._id, res);
      await newuser.save();
      return res.status(201).json({
        _id: newuser._id,
        fullname: newuser.fullname,
        username: newuser.username,

        email: newuser.email,
        followers: newuser.followers,
        following: newuser.following,
        coverimg: newuser.coverimg,
        profileimg: newuser.profileimg,
      });
    } else {
      return res.status(400).json({ error: "invalid iput data" });
    }
  } catch (error) {
    console.log(`error in signup controller ${error.message}`);
    return res.status(500).json("server error");
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const ispasswordcorrect = await bcrypt.compare(password, user?.password);
    if (!ispasswordcorrect) {
      return res.status(400).json({ error: "please enter a valid password" });
    }
    generatetokenandsetcookie(user._id, res);
    return res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      coverimg: user.coverimg,
      profileimg: user.profileimg,
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    return res.status(500).json("server");
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "user logged out successfully" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    return res.status(500).json("server error");
  }
};
export const getme = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    console.log("error in getme controller", error.message);
    return res.status(500).json("server error");
  }
};
