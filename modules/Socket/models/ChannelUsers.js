/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'
import { BaseModel } from '../../../models/BaseModel.js'

class ChannelUsers extends BaseModel {
  constructor() {
    super()
  }
}

const channelUsersSchema = new mongoose.Schema({
  channelId: { type: mongoose.Types.ObjectId, ref: 'channels', default: null },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  lastSeen: { type: Date, default: null },
  deletedAt: { type: Date, default: null },
  unseen: { type: Number, default: 0 }
})

channelUsersSchema.loadClass(ChannelUsers)

export default mongoose.model('channelUsers', channelUsersSchema)
