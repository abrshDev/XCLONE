import User from "../models/user.model.js";
import Notiffication from "../models/notiffication.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
export const getuserprofile = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log("error in get user profile controller", error.message);
    return res.status(500).json("server error");
  }
};
export const followunfollowuser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const usertomodify = await User.findById(id);
    const currentuser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You cannot follow/unfollow yourself" });
    }

    if (!currentuser || !usertomodify) {
      return res.status(404).json({ error: "User not found" });
    }

    const isfollowing = currentuser.following.includes(id);

    if (isfollowing) {
      // Unfollow the user
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow the user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
      // send notificationn to the user
      const newnotiffication = new Notiffication({
        type: "follow",
        from: req.user._id,

        to: usertomodify._id,
      });
      await newnotiffication.save();
      //todo return the id of the user as a response
      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.log("error in followunfollowuser:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const getsuggestedusers = async (req, res) => {
  try {
    const userid = req.user._id;
    const usersfollowedbyme = await User.findById(userid).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userid },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredusers = users.filter(
      (user) => !usersfollowedbyme.following.includes(user._id)
    );
    const suggestedusers = filteredusers.slice(0, 4);
    suggestedusers.forEach((user) => (user.password = null));
    return res.status(200).json(suggestedusers);
  } catch (error) {
    console.log("error in gegtsuggestedusers :", error.message);
    return res.status(500).json("server error");
  }
};

export const updateuser = async (req, res) => {
  try {
    const {
      fullname,
      email,
      username,
      currentpassword,
      newpassword,
      bio,
      link,
    } = req.body;
    let { profileimg, coverimg } = req.body;
    const userid = req.user._id;
    let user = await User.findById(userid);
    if (
      (!currentpassword && newpassword) ||
      (!newpassword && currentpassword)
    ) {
      return res.status(400).json({
        error: "please provide both the current password and the new password",
      });
    }

    if (currentpassword && newpassword) {
      const ismatch = await bcrypt.compare(currentpassword, user.password);
      if (newpassword.length < 6) {
        res
          .status(400)
          .json({ error: "password must be atleast 6 characters long" });
      }
      if (!ismatch) {
        return res
          .status(400)
          .json({ error: "please provide the correct password" });
      }
      if (ismatch) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newpassword, salt);
      }
    }

    if (profileimg) {
      if (user.profileimg) {
        await cloudinary.uploader.destroy(
          user.profileimg.split("/").pop().split(".")[0]
        );
      }
      const uploadresponse = await cloudinary.uploader.upload(profileimg);
      profileimg = uploadresponse.secure_url;
    }
    if (coverimg) {
      if (user.coverimg) {
        await cloudinary.uploader.destroy(
          user.coverimg.split("/").pop().split(".")[0]
        );
      }
      const uploadresponse = await cloudinary.uploader.upload(coverimg);
      profileimg = uploadresponse.secure_url;
    }

    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.coverimg = coverimg || user.coverimg;
    user.profileimg = profileimg || user.profileimg;
    user = await user.save();
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    console.log("error in updateuser :", error.message);
    return res.status(500).json("server error");
  }
};
