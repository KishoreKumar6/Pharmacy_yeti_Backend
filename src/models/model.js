import mongoose from 'mongoose'

const medicationSchema = new mongoose.Schema(
  {
    medicineName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['tablet', 'syrup', 'capsule'],
    },
    frequency: {
      type: [String],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'At least one frequency value is required',
      },
    },
    dosage: {
      type: String,
      required: true,
      enum: ['full', 'half'],
    },
    status: {
      type: String,
      enum: ['hold', 'confirm', 'cancel'],
      default: 'hold',
    },
    deliveryDate: {
      type: Date,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
    },
    totalUnits: {
      type: Number,
      required: true,
      min: 0.5,
    },
    renewalDate: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
)

const customerSchema = new mongoose.Schema(
  {
    personalDetail: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      age: {
        type: Number,
        required: true,
        min: 0,
      },
      gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
      },
      phoneNo: {
        type: String,
        required: true,
        trim: true,
        unique: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },
    medicationDetails: {
      type: [medicationSchema],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: 'At least one medication row is required',
      },
    },
    renewalDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Customer = mongoose.model('Customer', customerSchema)

export default Customer
