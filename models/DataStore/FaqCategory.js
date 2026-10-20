/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import mongoose from 'mongoose'

class FaqCategory extends BaseModel {
  constructor() {
    super()
  }
}

const FaqCategorySchema = mongoose.Schema({
  display_order: {
    type: String,
    default: '',
    options: {
      isSearch: true
    }
  },
  category: {
    type: String,
    default: '',
    options: {
      isSearch: true
    }
  },
  status: {
    type: String,
    default: true,
    options: {
      isSearch: true
    }
  },
  deletedAt: { type: Date, default: null }
})

FaqCategorySchema.loadClass(FaqCategory)

export default mongoose.model('FaqCategory', FaqCategorySchema)
