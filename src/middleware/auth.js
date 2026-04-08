import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/Config.js'

export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' })
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ message: 'JWT secret is not configured' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
