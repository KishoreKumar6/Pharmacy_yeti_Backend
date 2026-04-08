import express from 'express'
import cors from 'cors'
import { PORT } from './config/Config.js'
import { connectDatabase } from './utils/utils.js'
import router from './routes/route.js'
import { errorHandler, notFoundHandler } from './middleware/middleware.js'

const app = express()

app.use(
  cors({
    origin: '*',
  })
)
app.use(express.json())

app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Pharmacy backend API is running' })
})

app.get('/api/health', (_req, res) => {
  res.status(200).json({ message: 'Server is running' })
})

app.use('/api', router)
app.use(notFoundHandler)
app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDatabase()

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()
