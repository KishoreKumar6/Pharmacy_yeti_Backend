import mongoose from 'mongoose'
import { MONGODB_URI } from '../config/Config.js'

export const connectDatabase = async () => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in .env')
  }

  await mongoose.connect(MONGODB_URI, {
    dbName: 'pharmacy_yeti',
  })

  return mongoose.connection
}
