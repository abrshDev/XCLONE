import express from "express";
import { protectroute } from "../middleware/protectroute.js";
import {
  deletenotiffications,
  getnotiffication,
} from "../controllers/notiffication.controller.js";

const router = express.Router();
router.get("/", protectroute, getnotiffication);
router.delete("/", protectroute, deletenotiffications);
export default router;
