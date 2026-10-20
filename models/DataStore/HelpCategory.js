/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import mongoose from 'mongoose'

class HelpCategory extends BaseModel {
  constructor() {
    super()
  }
}

const HelpCategorySchema = mongoose.Schema({
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

HelpCategorySchema.loadClass(HelpCategory)

export default mongoose.model('HelpCategory', HelpCategorySchema)
