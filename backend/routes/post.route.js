import express from "express";
import { protectroute } from "../middleware/protectroute.js";
import {
  commentonpost,
  createpost,
  getallposts,
  likeunlikepost,
  deletepost,
  getuserposts,
  getfollowingposts,
  getlikedposts,
} from "../controllers/post.controller.js";
const router = express.Router();
router.post("/create", protectroute, createpost);
router.delete("/delete/:id", protectroute, deletepost);
router.post("/comment/:id", protectroute, commentonpost);
router.post("/like/:id", protectroute, likeunlikepost);

router.get("/all", protectroute, getallposts);
router.get("/like/:id", protectroute, getlikedposts);
router.get("/user/:username", protectroute, getuserposts);
router.get("/following", protectroute, getfollowingposts);
export default router;
