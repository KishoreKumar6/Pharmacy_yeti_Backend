import express from 'express'
import { loginHandler } from '../controllers/AuthController.js'
import {
  createCustomerHandler,
  deleteCustomerHandler,
  getCustomersHandler,
  getMedicinesHandler,
  updateCustomerHandler,
} from '../controllers/Controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.post('/auth/login', loginHandler)

router.use(requireAuth)

router.get('/customers', getCustomersHandler)
router.post('/customers', createCustomerHandler)
router.put('/customers/:id', updateCustomerHandler)
router.delete('/customers/:id', deleteCustomerHandler)
router.get('/medicines', getMedicinesHandler)

export default router
