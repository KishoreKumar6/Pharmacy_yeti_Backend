import Customer from '../models/model.js'
import Medicine from '../models/Medicine.js'

export const createCustomer = async (customerPayload) => {
  const customer = await Customer.create(customerPayload)
  return customer
}

export const getCustomerByPhone = async (phoneNo) => {
  const customer = await Customer.findOne({ 'personalDetail.phoneNo': phoneNo }).lean()
  return customer
}

export const getAllCustomers = async () => {
  const customers = await Customer.find().sort({ createdAt: -1 }).lean()
  return customers
}

export const updateCustomer = async (id, payload) => {
  const customer = await Customer.findByIdAndUpdate(id, payload, { new: true })
  return customer
}

export const deleteCustomer = async (id) => {
  const customer = await Customer.findByIdAndDelete(id)
  return customer
}

export const upsertMedicines = async (names) => {
  const normalized = names
    .filter((name) => typeof name === 'string')
    .map((name) => name.trim())
    .filter((name) => name.length > 0)

  const uniqueNames = Array.from(new Set(normalized.map((name) => name.toLowerCase()))).map(
    (name) => normalized.find((item) => item.toLowerCase() === name) || name
  )

  if (uniqueNames.length === 0) return

  const operations = uniqueNames.map((name) => ({
    updateOne: {
      filter: { normalizedName: name.toLowerCase() },
      update: {
        $setOnInsert: {
          name,
          normalizedName: name.toLowerCase(),
        },
      },
      upsert: true,
    },
  }))

  await Medicine.bulkWrite(operations, { ordered: false })
}

export const getAllMedicines = async () => {
  const medicines = await Medicine.find().sort({ name: 1 }).lean()
  return medicines
}
