/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

class Faq extends BaseModel {
  constructor() {
    super()
  }
}

const FaqSchema = mongoose.Schema({
  category_id: { type: ObjectId, ref: 'faqcategories', default: null },
  display_order: {
    type: String,
    default: '',
    options: {
      isSearch: true
    }
  },
  question: {
    type: String,
    default: '',
    options: {
      isSearch: true
    }
  },
  answer: {
    type: String,
    default: true,
    options: {
      isSearch: true
    }
  },
  deletedAt: { type: Date, default: null }
})

FaqSchema.loadClass(Faq)

export default mongoose.model('Faq', FaqSchema)
