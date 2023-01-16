import { Pool } from "pg";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const pool = new Pool();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export const addFilter = async (req: Request, res: Response) => {
  const userId = Number(req.params.user_id);
  const { transaction, category } = req.body;

  try {
    const result = await prisma.filter.create({
      data: {
        transaction,
        category,
        userId,
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ msg: error.message });
  } finally {
    await prisma.$disconnect();
    process.exit(1);
  }
};

export const getFilters = async (req: Request, res: Response) => {
  const userId = Number(req.params.user_id);
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        filters: true,
      },
    });
    console.log(user);
    res.status(200).json(user.filters);
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ msg: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

export const editFilter = async (req: Request, res: Response) => {
  const filterId = Number(req.params.filter_id);
  const { transaction, category } = req.body;

  try {
    const updatedFilter = await prisma.filter.update({
      where: { id: filterId },
      data: { transaction, category },
    });
    res.status(200).json(updatedFilter);
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ msg: error.message });
  } finally {
    prisma.$disconnect();
    process.exit(1);
  }
};

export const deleteFilter = async (req: Request, res: Response) => {
  const filterId = Number(req.params.filter_id);

  try {
    const delFilter = await prisma.filter.delete({
      where: { id: filterId },
    });
    res.status(200).json(delFilter);
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ msg: error.message });
  } finally {
    prisma.$disconnect();
    process.exit(1);
  }
};

const checkEmptyStrings = (strArr: string[] | null[]) => {
  let isInvalid = false;
  strArr.forEach((str) => {
    if (str.trim() === "" || str === null) {
      isInvalid = true;
    }
  });
  return isInvalid;
};

export const addNewUser = async (req: Request, res: Response) => {
  const { name, email, password } = JSON.parse(JSON.stringify(req.body));
  const saltRounds = 10;

  try {
    if (checkEmptyStrings([name, email, password])) {
      res.status(400);
      throw new Error("Invalid credentials. Check all fields are filled.");
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    if (createdUser) {
      const { id } = createdUser;
      const token = jwt.sign(
        {
          id,
          name,
          email,
        },
        JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );
      res.status(201).json(token);
    }
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ msg: error.message });
  } finally {
    prisma.$disconnect();
    process.exit(1);
  }
};

export const checkUser = async (req: Request, res: Response) => {
  const { email, password } = JSON.parse(JSON.stringify(req.body));

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { email },
    });

    if (!user) {
      res.status(400);
      throw new Error("User not found. Check credentials or sign up.");
    }
    const { password: hashedPassword } = user;
    const isUser = await bcrypt.compare(password, hashedPassword);

    if (isUser) {
      const { id, name, email } = user;
      const token = jwt.sign(
        {
          id,
          name,
          email,
        },
        JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );
      res.status(200).json(token);
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    console.error("Error: ", error.message);
    res.status(400).json({ msg: error.message });
  }
};
