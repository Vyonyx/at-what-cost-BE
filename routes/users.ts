import express from "express";
import { addNewUser, checkUser } from "../db";
const router = express.Router();

router.post("/signup", addNewUser);
router.post("/login", checkUser);

export default router;
