/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import mongoose from 'mongoose'

class ParcelType extends BaseModel {
  constructor() {
    super()
  }
}

const ParcelTypeSchema = mongoose.Schema({
  name: {
    type: String,
    default: '',
    options: {
      isSearch: true
    }
  },
  status: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null }
})

ParcelTypeSchema.loadClass(ParcelType)

export default mongoose.model('ParcelType', ParcelTypeSchema)
