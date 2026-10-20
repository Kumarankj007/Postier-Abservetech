/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'

const cmsSchema = new mongoose.Schema(
  {
    type: { type: String, default: '' },
    title: { type: String, default: '' },
    content: { type: String, default: '' }
  },
  { timestamps: true }
)

export default mongoose.model('cms', cmsSchema)
