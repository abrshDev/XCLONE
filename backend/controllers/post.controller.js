import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notiffication from "../models/notiffication.model.js";
import { v2 as cloudinary } from "cloudinary";
export const createpost = async (req, res) => {
  try {
    let { img } = req.body;
    let { text } = req.body;
    const userid = req.user._id;
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    if (!img && !text) {
      return res
        .status(400)
        .json({ error: "you have to provide both text or image" });
    }
    if (img) {
      const uploadresponse = await cloudinary.uploader.upload(img);
      img = uploadresponse.secure_url;
    }
    const newpost = new Post({
      user: user._id,
      text,
      img,
    });
    await newpost.save();
    return res.status(201).json(newpost);
  } catch (error) {
    console.log("error in create post controller", error.message);
    return res.status(500).json("server error");
  }
};

export const deletepost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "you are not authorized to delete this post" });
    }
    if (post.img) {
      const imgid = await post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgid);
    }

    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    console.log("error in deletepost controller :", error.message);
    return res.status(500).json("server error");
  }
};

export const commentonpost = async (req, res) => {
  try {
    const postid = req.params.id;
    const userid = req.user._id;
    const { text } = req.body;
    const post = await Post.findById(postid);
    if (!text) {
      return res.status(400).json({ error: "please provide text input" });
    }
    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }
    const comment = { user: userid, text };
    post.comments.push(comment);
    await post.save();
    return res.status(201).json(post);
  } catch (error) {
    console.log("error in commentonpost controller :", error.message);
    return res.status(500).json("server error");
  }
};

export const likeunlikepost = async (req, res) => {
  try {
    const { id: postid } = req.params;
    const userid = req.user._id;
    const post = await Post.findById(postid);
    const user = await User.findById(userid);
    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const likedpost = await post.likes.includes(userid);
    if (likedpost) {
      //unlike

      await Post.updateOne({ _id: postid }, { $pull: { likes: userid } });
      await User.updateOne({ _id: userid }, { $pull: { likedposts: postid } });
      return res.status(200).json({ message: "post unliked successfully" });
    } else {
      //like post
      post.likes.push(userid);
      await User.updateOne({ _id: userid }, { $push: { likedposts: postid } });
      await post.save();
      const newnotiffication = new Notiffication({
        from: userid,
        to: post.user,
        type: "like",
      });
      await newnotiffication.save();
      return res.status(200).json({ message: "post liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
    console.log("error on like post : ", error.message);
  }
};

export const getallposts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    if (posts.length === 0) {
      res.status(200).json([]);
    }

    return res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
    console.log("error on getall post : ", error.message);
  }
};
export const getlikedposts = async (req, res) => {
  const userid = req.params.id;
  try {
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const likedposts = await Post.find({ _id: { $in: user.likedposts } })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    return res.status(200).json(likedposts);
  } catch (error) {
    return res.status(500).json({ error: "internal server error" });
    console.log("error on get liked posts: ", error.message);
  }
};
export const getfollowingposts = async (req, res) => {
  try {
    const userid = req.user._id;
    const user = await User.findById(userid);
    if (!user) return res.status(404).json({ error: "user not found" });
    const following = user.following;
    const feedposts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });
    return res.status(200).json(feedposts);
  } catch (error) {
    console.log("error on get following posts: ", error.message);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const getuserposts = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "comments.user", select: "-password" });

    res.status(200).json({ posts });
  } catch (error) {
    console.log("error in get user posts controller : ", error.message);
    return res.status(500).json("server error");
  }
};
