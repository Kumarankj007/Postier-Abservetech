/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'
import { BaseModel } from '../../../models/BaseModel.js'
import { Enum } from '../../../utils/Enum.js'

class Messages extends BaseModel {
  constructor() {
    super()
  }
}

const messageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
    userType: {
      type: String,
      enum: [Enum.ROLES.ADMIN, Enum.ROLES.USER],
      default: Enum.ROLES.USER
    },
    channelId: { type: mongoose.Types.ObjectId, ref: 'channels', default: null },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['text', 'file', 'image', 'bidding'],
      default: 'text'
    },
    content: { type: String, default: '' },
    context: { type: mongoose.Types.ObjectId, ref: 'messages', default: null },
    status: { type: String },
    seen: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
)

messageSchema.loadClass(Messages)

export default mongoose.model('messages', messageSchema)
