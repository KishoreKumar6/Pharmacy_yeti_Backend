import express from 'express'
import {
  createCustomerHandler,
  deleteCustomerHandler,
  getCustomersHandler,
  getMedicinesHandler,
  updateCustomerHandler,
} from '../controllers/Controller.js'

const router = express.Router()

router.get('/customers', getCustomersHandler)
router.post('/customers', createCustomerHandler)
router.put('/customers/:id', updateCustomerHandler)
router.delete('/customers/:id', deleteCustomerHandler)
router.get('/medicines', getMedicinesHandler)

export default router
