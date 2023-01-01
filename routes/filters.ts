import express from 'express'
import * as db from '../db'

const router = express.Router()

router.get('/:user_id', db.getFilters)
router.post('/:user_id', db.addFilter)
router.patch('/:user_id/:filter_id', db.editFilter)
router.delete('/:user_id/:filter_id', db.deleteFilter)

export default router