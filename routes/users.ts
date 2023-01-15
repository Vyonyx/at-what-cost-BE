import express from "express";
import { addNewUser } from "../db";
const router = express.Router();

router.post("/", addNewUser);

export default router;
