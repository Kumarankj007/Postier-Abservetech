/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'
import { Enum } from '../../utils/Enum.js'

const biddingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: [Enum.TRIP.STATUS.REQUESTED, Enum.TRIP.STATUS.ACCEPTED, Enum.TRIP.STATUS.DECLINED],
      default: Enum.TRIP.STATUS.REQUESTED,
      required: true
    }
  },
  { timestamps: true }
)

const requestSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Types.ObjectId, ref: 'Post', required: true },
    tripId: { type: mongoose.Types.ObjectId, ref: 'Trip', required: true },
    transmitterId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: [Enum.TRIP.STATUS.REQUESTED, Enum.TRIP.STATUS.ACCEPTED, Enum.TRIP.STATUS.DECLINED],
      default: Enum.TRIP.STATUS.REQUESTED
    },
    fare: { type: Number, default: 25, required: true },
    bidding: [biddingSchema]
  },
  { timestamps: true }
)

export default mongoose.model('Request', requestSchema)
