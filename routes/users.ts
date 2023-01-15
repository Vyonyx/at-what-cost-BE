import express from "express";
import { addNewUser, checkUser } from "../db";
const router = express.Router();

router.post("/", addNewUser);
router.get("/", checkUser);

export default router;
