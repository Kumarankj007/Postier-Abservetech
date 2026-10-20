/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'

class Suggestions {
  constructor() {}
}

const SuggestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    default: null
  },
  coordinates: {
    type: Array,
    default: [0, 0]
  },
  primaryAddress: {
    type: String,
    default: ''
  },
  secondaryAddress: {
    type: String,
    default: ''
  },
  place_id: {
    type: String,
    default: ''
  },
  frequency: {
    type: Number,
    default: 1
  },
  lastSearch: {
    type: Date,
    default: new Date()
  },
  city: {
    type: String,
    default: ''
  }
})

SuggestionSchema.index({ userId: 1 })

SuggestionSchema.loadClass(Suggestions)

export default mongoose.model('Suggestion', SuggestionSchema)
