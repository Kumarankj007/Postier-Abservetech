/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'
import { BaseModel } from '../../../models/BaseModel.js'

class Channels extends BaseModel {
  constructor() {
    super()
  }
}

const channelSchema = new mongoose.Schema(
  {
    creatorId: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
    tripId: { type: mongoose.Types.ObjectId, ref: 'Trip', default: null },
    postId: { type: mongoose.Types.ObjectId, ref: 'Post', default: null },
    supportId: { type: mongoose.Types.ObjectId, default: null }
  },
  { timestamps: true }
)

// Define a virtual field for channel users
channelSchema.virtual('channelUsers', {
  ref: 'channelUsers',
  localField: '_id',
  foreignField: 'channelId'
})

channelSchema.loadClass(Channels)

export default mongoose.model('channels', channelSchema)
