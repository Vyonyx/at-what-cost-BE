import { Pool } from "pg";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const pool = new Pool();

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

export const addNewUser = (req: Request, res: Response) => {
  const { name, email, password } = JSON.parse(JSON.stringify(req.body));
  const saltRounds = 10;

  bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      pool
        .query(
          "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
          [name, email, hash]
        )
        .then(() => res.status(201).json({ msg: "New user created!" }))
        .catch((err) => res.status(500).json({ msg: err.message }));
    })
    .catch((err) => res.status(500).json({ msg: err.message }));
};

export const checkUser = async (req: Request, res: Response) => {
  const { email, password } = JSON.parse(JSON.stringify(req.body));

  try {
    const user = await (
      await pool.query(`SELECT * FROM users WHERE email = '${email}'`)
    ).rows[0];

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    const { password: hashedPassword } = user;
    const isUser = await bcrypt.compare(password, hashedPassword);
    res.status(200).json(isUser);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
