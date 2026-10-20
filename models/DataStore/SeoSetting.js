/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import mongoose from 'mongoose'

class SeoSetting extends BaseModel {
  constructor() {
    super()
  }
}

const SeoSettingSchema = mongoose.Schema(
  {
    keyword: {
      type: String,
      options: {
        isSearch: true
      },
      default: ''
    },
    title: {
      type: String,
      options: {
        isSearch: true
      },
      default: ''
    },
    description: {
      type: String,
      options: {
        isSearch: true
      },
      default: ''
    }
  },
  { timestamps: true }
)

SeoSettingSchema.loadClass(SeoSetting)

export default mongoose.model('SeoSetting', SeoSettingSchema)
