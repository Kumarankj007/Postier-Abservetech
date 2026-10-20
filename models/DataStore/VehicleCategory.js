/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import mongoose from 'mongoose'

class VehicleCategory extends BaseModel {
  constructor() {
    super()
  }
}

const VehicleCategorySchema = mongoose.Schema(
  {
    name: { type: String, default: '' },
    image: { type: String, default: '' }
  },
  { timestamps: true }
)

VehicleCategorySchema.loadClass(VehicleCategory)

export default mongoose.model('VehicleCategory', VehicleCategorySchema)
