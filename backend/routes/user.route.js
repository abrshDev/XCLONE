import express from "express";
import { protectroute } from "../middleware/protectroute.js";
import {
  followunfollowuser,
  getsuggestedusers,
  getuserprofile,
  updateuser,
} from "../controllers/user.controller.js";
const router = express.Router();
router.get("/profile/:username", protectroute, getuserprofile);
router.post("/follow/:id", protectroute, followunfollowuser);
router.get("/suggested", protectroute, getsuggestedusers);
router.post("/update", protectroute, updateuser);
export default router;
