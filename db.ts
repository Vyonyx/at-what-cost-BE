import { Pool } from "pg";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const pool = new Pool();
const JWT_SECRET = process.env.JWT_SECRET;

export const addFilter = (req: Request, res: Response) => {
  const userID = req.params.user_id;
  const { transaction, category } = req.body;

  pool
    .query(
      `INSERT INTO filters (user_id, transaction, category) VALUES ($1, $2, $3)`,
      [userID, transaction, category]
    )
    .then((results) =>
      res.status(201).send(`New filter created for user ID: ${userID}`)
    )
    .catch((error) => {
      console.error(error);
      res.status(400);
    });
};

export const getFilters = (req: Request, res: Response) => {
  const userID = req.params.user_id;

  pool
    .query("SELECT * FROM filters WHERE user_id = $1", [userID])
    .then((results) => res.status(200).json(results.rows))
    .catch((error) => {
      console.error(error);
      res.status(400);
    });
};

export const editFilter = (req: Request, res: Response) => {
  const filterID = req.params.filter_id;
  const { transaction, category } = req.body;

  pool
    .query("UPDATE filters SET transaction = $1, category = $2 WHERE id = $3", [
      transaction,
      category,
      filterID,
    ])
    .then((results) => res.send(200).send(`Filter ID: ${filterID} edited.`))
    .catch((error) => {
      console.error(error);
      res.status(400);
    });
};

export const deleteFilter = (req: Request, res: Response) => {
  const filterID = req.params.filter_id;

  pool
    .query("DELETE FROM filters WHERE id = $1", [filterID])
    .then((results) => res.send(200).send(`Filter ID: ${filterID} deleted.`))
    .catch((error) => {
      console.error(error);
      res.status(400);
    });
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
    const createdUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      [name, email, hash]
    );
    if (createdUser) {
      console.log(JWT_SECRET);
      const { id } = createdUser.rows[0];
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
  }
};

export const checkUser = async (req: Request, res: Response) => {
  const { email, password } = JSON.parse(JSON.stringify(req.body));

  try {
    const user = await (
      await pool.query(`SELECT * FROM users WHERE email = '${email}'`)
    ).rows[0];

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
