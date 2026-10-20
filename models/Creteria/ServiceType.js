/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import mongoose from 'mongoose'

class ServiceType extends BaseModel {
  constructor() {
    super()
  }
}

const ServiceTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
      options: {
        isSearch: true
      }
    },
    description: { type: String, default: '' },
    image: { type: String, default: 'public/serviceType/default.png' },
    topViewImage: { type: String, default: 'public/serviceType/default.png' },

    order: {
      type: Number,
      default: 0,
      options: {
        isSearch: true
      }
    },
    gender: { type: String, default: 'Male', enum: ['Male', 'Female', 'Others', 'All'] },
    features: { type: [String], default: [] },
    capacity: {
      type: Number,
      default: 0,
      options: {
        isSearch: true
      }
    },
    weight: { type: Number, default: 0 },

    status: { type: String, default: 'Available', enum: ['Available', 'Un-available'] },
    way: { type: String, enum: ['road', 'air', 'sea', 'rail'] },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
)

ServiceTypeSchema.loadClass(ServiceType)

export default mongoose.model('ServiceType', ServiceTypeSchema)
