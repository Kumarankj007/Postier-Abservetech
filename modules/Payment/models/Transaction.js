/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../../../models/BaseModel.js'
import mongoose, { ObjectId } from 'mongoose'

import { Enum } from '../../../utils/Enum.js'

class Transaction extends BaseModel {
  constructor() {
    super()
  }
}

const TransactionSchema = mongoose.Schema(
  {
    module: {
      type: String,
      enum: [
        Enum.PAYMENT.MODULES.TRIP,
        Enum.PAYMENT.MODULES.SUBSCRIPTION,
        Enum.PAYMENT.MODULES.ADJUSTMENT,
        Enum.PAYMENT.MODULES.REFUND
      ],
      default: Enum.PAYMENT.MODULES.TRIP,
      options: {
        isSearch: true
      }
    },
    referenceId: {
      type: String,
      default: null,
      options: {
        isSearch: true
      }
    },
    description: { type: String, default: null },

    userId: { type: ObjectId, default: null },
    userType: {
      type: String,
      enum: [Enum.ROLES.ADMIN, Enum.ROLES.USER],
      default: Enum.ROLES.ADMIN
    },

    // paidAmount: { type: Number, default: 0 },
    // payableAmount: { type: Number, default: 0 },
    // earnings: { type: Number, default: 0 },

    amount: {
      type: Number,
      default: 0,
      options: {
        isSearch: true
      }
    },
    mode: {
      type: String,
      enum: [Enum.PAYMENT.MODE.CREDIT, Enum.PAYMENT.MODE.DEBIT],
      default: Enum.PAYMENT.MODE.CREDIT,
      options: {
        isSearch: true
      }
    },
    balance: { type: Number, default: 0 },
    tax: { type: Number },

    createdBy: {
      type: String,
      enum: [Enum.ROLES.ADMIN, Enum.ROLES.USER],
      default: Enum.ROLES.ADMIN
    },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true, usePushEach: true }
)

TransactionSchema.loadClass(Transaction)

export default mongoose.model('transaction', TransactionSchema)
