import { Pool } from "pg";
import { Request, Response } from "express";
import { send } from "process";

const DATABASE = process.env.PGDATABASE
const USER = process.env.PGUSER
const PORT = process.env.PGPORT
const HOST = process.env.PGHOST
const PASSWORD = process.env.PGPASSWORD

const pool = new Pool({
  user: USER,
  host: HOST,
  database: DATABASE,
  password: PASSWORD,
  port: Number(PORT) || 5432
})

export const addFilter = (req: Request, res: Response) => {
  const userID = req.params.user_id
  const { transaction_name, category } = req.body

  pool.query(
    `INSERT INTO filters (user_id, transaction_name, category) VALUES ($1, $2, $3)`,
    [ userID, transaction_name, category ]
  )
    .then(results => res.status(201).send(`New filter created for user ID: ${userID}`))
    .catch(error => {
      console.error(error)
      res.status(400)
    })
}

export const getFilters = (req: Request, res: Response) => {
  const userID = req.params.user_id

  pool.query('SELECT * FROM filters WHERE user_id = $1', [userID])
    .then(results => res.status(200).json(results.rows))
    .catch(error => {
      console.error(error)
      res.status(400)
    })
}

export const editFilter = (req: Request, res: Response) => {
  const filterID = req.params.filter_id
  const { transaction_name, category } = req.body

  pool.query(
    'UPDATE filters SET transaction_name = $1, category = $2 WHERE id = $3',
    [transaction_name, category, filterID]
  )
    .then(results => res.send(200).send(`Filter ID: ${filterID} edited.`))
    .catch(error => {
      console.error(error)
      res.status(400)
    })
}

export const deleteFilter = (req: Request, res: Response) => {
  const filterID = req.params.filter_id
  
  pool.query('DELETE FROM filters WHERE id = $1', [filterID])
  .then(results => res.send(200).send(`Filter ID: ${filterID} deleted.`))
  .catch(error => {
    console.error(error)
    res.status(400)
  })
}
