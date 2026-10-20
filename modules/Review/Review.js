/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'

class ReviewRating {
  constructor() {}
}

const ReviewRatingSchema = new mongoose.Schema(
  {
    // Sender
    reviewed: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      default: null
    },
    // Google the term reviewee
    // Receiver
    reviewee: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      default: null
    },
    module: {
      type: String,
      enum: ['Trip', 'Post']
    },
    moduleId: {
      type: mongoose.Types.ObjectId,
      refPath: 'module',
      default: null
    },
    rating: {
      type: Number,
      default: 0
    },
    comments: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

ReviewRatingSchema.loadClass(ReviewRating)

export default mongoose.model('ReviewRating', ReviewRatingSchema)
