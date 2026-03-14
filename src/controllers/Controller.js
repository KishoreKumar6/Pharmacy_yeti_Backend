import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getAllMedicines,
  updateCustomer,
  upsertMedicines,
} from '../services/service.js'

const ALLOWED_GENDER = ['male', 'female', 'other']
const ALLOWED_TYPES = ['tablet', 'syrup', 'capsule']
const ALLOWED_DOSAGE = ['full', 'half']
const ALLOWED_FREQUENCY = ['morning', 'afternoon', 'evening', 'night']

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

const normalizeDate = (days) => {
  const renewalDate = new Date()
  renewalDate.setHours(0, 0, 0, 0)
  renewalDate.setDate(renewalDate.getDate() + Number(days))
  return renewalDate
}

const calculateTotalUnits = ({ dosage, days, frequencyCount }) => {
  const dosageMultiplier = dosage === 'half' ? 0.5 : 1
  return dosageMultiplier * days * frequencyCount
}

const validateAndNormalizePayload = (personalDetail, medicationDetails) => {
  if (!personalDetail || !medicationDetails) {
    return { error: 'personalDetail and medicationDetails are required' }
  }

  if (!Array.isArray(medicationDetails) || medicationDetails.length === 0) {
    return { error: 'At least one medication row is required' }
  }

  const age = Number(personalDetail.age)

  if (!isNonEmptyString(personalDetail.name)) {
    return { error: 'Name is required' }
  }

  if (!Number.isFinite(age) || age <= 0) {
    return { error: 'Age must be a valid number greater than 0' }
  }

  if (!ALLOWED_GENDER.includes(personalDetail.gender)) {
    return { error: 'Gender must be male, female or other' }
  }

  if (!isNonEmptyString(personalDetail.phoneNo)) {
    return { error: 'Phone number is required' }
  }

  if (!isNonEmptyString(personalDetail.address)) {
    return { error: 'Address is required' }
  }

  const validatedRows = []

  for (const row of medicationDetails) {
    const days = Number(row.days)

    if (!isNonEmptyString(row.medicineName)) {
      return { error: 'Medicine name is required in all rows' }
    }

    if (!ALLOWED_TYPES.includes(row.type)) {
      return { error: 'Type must be tablet, syrup or capsule' }
    }

    if (!ALLOWED_DOSAGE.includes(row.dosage)) {
      return { error: 'Dosage must be full or half' }
    }

    if (!Array.isArray(row.frequency) || row.frequency.length === 0) {
      return { error: 'At least one frequency is required for each medicine row' }
    }

    const hasInvalidFrequency = row.frequency.some((item) => !ALLOWED_FREQUENCY.includes(item))
    if (hasInvalidFrequency) {
      return { error: 'Frequency values are invalid' }
    }

    if (!Number.isFinite(days) || days <= 0) {
      return { error: 'Days must be a valid number greater than 0' }
    }

    const totalUnits = calculateTotalUnits({
      dosage: row.dosage,
      days,
      frequencyCount: row.frequency.length,
    })

    validatedRows.push({
      medicineName: row.medicineName.trim(),
      type: row.type,
      frequency: row.frequency,
      dosage: row.dosage,
      days,
      totalUnits,
      renewalDate: normalizeDate(days),
    })
  }

  const nextRenewalDate = validatedRows
    .map((row) => row.renewalDate)
    .sort((a, b) => new Date(a) - new Date(b))[0]

  const payload = {
    personalDetail: {
      name: personalDetail.name.trim(),
      age,
      gender: personalDetail.gender,
      phoneNo: personalDetail.phoneNo.trim(),
      address: personalDetail.address.trim(),
    },
    medicationDetails: validatedRows,
    renewalDate: nextRenewalDate,
  }

  return { payload, validatedRows }
}

export const createCustomerHandler = async (req, res, next) => {
  try {
    const { personalDetail, medicationDetails } = req.body

    const { error, payload, validatedRows } = validateAndNormalizePayload(
      personalDetail,
      medicationDetails
    )

    if (error) {
      return res.status(400).json({ message: error })
    }

    await upsertMedicines(validatedRows.map((row) => row.medicineName))

    const customer = await createCustomer(payload)

    return res.status(201).json({
      message: 'Customer registered successfully',
      customer,
    })
  } catch (error) {
    return next(error)
  }
}

export const getCustomersHandler = async (_req, res, next) => {
  try {
    const customers = await getAllCustomers()
    return res.status(200).json({ customers })
  } catch (error) {
    return next(error)
  }
}

export const getMedicinesHandler = async (_req, res, next) => {
  try {
    const medicines = await getAllMedicines()
    return res.status(200).json({ medicines })
  } catch (error) {
    return next(error)
  }
}

export const updateCustomerHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    const { personalDetail, medicationDetails } = req.body

    const { error, payload, validatedRows } = validateAndNormalizePayload(
      personalDetail,
      medicationDetails
    )

    if (error) {
      return res.status(400).json({ message: error })
    }

    await upsertMedicines(validatedRows.map((row) => row.medicineName))

    const customer = await updateCustomer(id, payload)

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    return res.status(200).json({
      message: 'Customer updated successfully',
      customer,
    })
  } catch (error) {
    return next(error)
  }
}

export const deleteCustomerHandler = async (req, res, next) => {
  try {
    const { id } = req.params
    const customer = await deleteCustomer(id)

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' })
    }

    return res.status(200).json({ message: 'Customer deleted successfully' })
  } catch (error) {
    return next(error)
  }
}
