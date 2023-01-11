import dotenv from 'dotenv'
import express from 'express'
import filtersRouter from './routes/filters'

dotenv.config()
const PORT = process.env.PORT || 3333

const app = express()

/* Configuration */
app.use(express.json())
app.use(express.urlencoded({ extended:false }))

/* Routes */
app.use('/filters', filtersRouter)

app.get('/greet', (req, res) => {
  return res.send('Hello')
})

app.get('/', (req, res) => {
  return res.send('Server is up & running.')
})


app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})