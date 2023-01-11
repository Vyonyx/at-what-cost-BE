"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFilter = exports.editFilter = exports.getFilters = exports.addFilter = void 0;
const pg_1 = require("pg");
const DATABASE = process.env.PGDATABASE;
const USER = process.env.PGUSER;
const PORT = process.env.PGPORT;
const HOST = process.env.PGHOST;
const PASSWORD = process.env.PGPASSWORD;
// const pool = new Pool({
//   user: USER,
//   host: HOST,
//   database: DATABASE,
//   password: PASSWORD,
//   port: Number(PORT) || 5432
// })
const pool = new pg_1.Pool();
const addFilter = (req, res) => {
    const userID = req.params.user_id;
    const { transaction, category } = req.body;
    pool.query(`INSERT INTO filters (user_id, transaction, category) VALUES ($1, $2, $3)`, [userID, transaction, category])
        .then(results => res.status(201).send(`New filter created for user ID: ${userID}`))
        .catch(error => {
        console.error(error);
        res.status(400);
    });
};
exports.addFilter = addFilter;
const getFilters = (req, res) => {
    const userID = req.params.user_id;
    pool.query('SELECT * FROM filters WHERE user_id = $1', [userID])
        .then(results => res.status(200).json(results.rows))
        .catch(error => {
        console.error(error);
        res.status(400);
    });
};
exports.getFilters = getFilters;
const editFilter = (req, res) => {
    const filterID = req.params.filter_id;
    const { transaction, category } = req.body;
    pool.query('UPDATE filters SET transaction = $1, category = $2 WHERE id = $3', [transaction, category, filterID])
        .then(results => res.send(200).send(`Filter ID: ${filterID} edited.`))
        .catch(error => {
        console.error(error);
        res.status(400);
    });
};
exports.editFilter = editFilter;
const deleteFilter = (req, res) => {
    const filterID = req.params.filter_id;
    pool.query('DELETE FROM filters WHERE id = $1', [filterID])
        .then(results => res.send(200).send(`Filter ID: ${filterID} deleted.`))
        .catch(error => {
        console.error(error);
        res.status(400);
    });
};
exports.deleteFilter = deleteFilter;
//# sourceMappingURL=db.js.map