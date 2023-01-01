import dotenv from 'dotenv'
import express from 'express'
import filtersRouter from './routes/filters'

dotenv.config()
const PORT = process.env.PORT

const app = express()

/* Configuration */
app.use(express.json())
app.use(express.urlencoded({ extended:false }))

/* Routes */
app.use('/filters', filtersRouter)

app.get('/', (req, res) => {
  return res.send('Server is up & running.')
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})