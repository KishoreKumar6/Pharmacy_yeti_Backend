import jwt from 'jsonwebtoken'
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  JWT_EXPIRES_IN,
  JWT_SECRET,
} from '../config/Config.js'

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

export const loginHandler = (req, res) => {
  const { username, password } = req.body || {}

  if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
    return res.status(400).json({ message: 'Username and password are required' })
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ message: 'JWT secret is not configured' })
  }

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return res.status(500).json({ message: 'Admin credentials are not configured' })
  }

  const isValid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

  return res.status(200).json({
    token,
    expiresIn: JWT_EXPIRES_IN,
  })
}
