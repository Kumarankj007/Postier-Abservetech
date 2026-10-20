/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import { Enum } from '../../utils/Enum.js'
import mongoose from 'mongoose'

class Verification extends BaseModel {
  constructor() {
    super()
  }
}

const VerificationSchema = mongoose.Schema(
  {
    phoneCode: { type: String, default: '' },
    phoneNumber: { type: String, default: '', unique: true },
    email: { type: String, default: '' },

    otp: { type: String, default: '' },
    userType: {
      type: String,
      enum: [Enum.ROLES.ADMIN, Enum.ROLES.USER],
      default: Enum.ROLES.ADMIN
    },

    verified: { type: Boolean, default: false },
    verifyBy: { type: String, enum: ['email', 'phone'], default: '' },
    verifyFrom: { type: String, default: 'login' },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
)

VerificationSchema.loadClass(Verification)

export default mongoose.model('Verification', VerificationSchema)
