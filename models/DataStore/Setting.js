/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

class Setting extends BaseModel {
  constructor() {
    super()
  }
}

const SettingSchema = mongoose.Schema(
  {
    page: {
      type: String,
      options: {
        isSearch: true
      },
      default: ''
    },
    content: {
      type: String,
      options: {
        isSearch: true
      },
      default: ''
    },
    updatedBy: {
      userId: { type: ObjectId },
      role: { type: String }
    }
  },
  { timestamps: true }
)

SettingSchema.pre('save', async function () {
  let eventsArr = []
  const updatedFields = Object.values(this.modifiedPaths())
  if (this.events && this.events.length > 0) {
    eventsArr = this.events.map((item) => {
      item.updatedAt = this.updatedAt
      item.description = 'Last Updated fields are ' + updatedFields.join(',')
      item.userId = this.updatedBy.userId
      item.userType = this.updatedBy.role
      return item
    })
  } else {
    eventsArr.push({
      updatedAt: this.updatedAt,
      description: 'Last Updated fields are ' + updatedFields.join(','),
      userId: this.updatedBy.userId,
      userType: this.updatedBy.role
    })
  }
  this.events = eventsArr
})

SettingSchema.pre('find', function (next) {
  // remove is a one of the hook here we replace the any particular hook
  this.model().softDeleteMiddleware.bind(this)(next, this._mongooseOptions.queryOptions)
})

SettingSchema.loadClass(Setting)

export default mongoose.model('Setting', SettingSchema)
