import express from "express";
import { protectroute } from "../middleware/protectroute.js";
import {
  getme,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protectroute, getme);

export default router;
