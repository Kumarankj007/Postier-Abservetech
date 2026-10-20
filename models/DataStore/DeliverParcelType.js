/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import mongoose from 'mongoose'

class DeliverParcelType extends BaseModel {
  constructor() {
    super()
  }
}

const DeliverParcelTypeSchema = mongoose.Schema({
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

DeliverParcelTypeSchema.loadClass(DeliverParcelType)

export default mongoose.model('DeliverParcelType', DeliverParcelTypeSchema)
