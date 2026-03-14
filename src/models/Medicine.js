import mongoose from 'mongoose'

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    normalizedName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

medicineSchema.pre('validate', function setNormalizedName(next) {
  if (typeof this.name === 'string') {
    this.normalizedName = this.name.trim().toLowerCase()
  }
  next()
})

const Medicine = mongoose.model('Medicine', medicineSchema)

export default Medicine
