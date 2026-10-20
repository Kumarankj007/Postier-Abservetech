/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import mongoose from 'mongoose'
import { Enum } from '../../utils/Enum.js'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

class Vehicle extends BaseModel {
  constructor() {
    super()
  }
}

const Document = new mongoose.Schema({
  name: { type: String },
  status: { type: String, enum: ['approved', 'rejected', 'pending'], default: 'pending' },
  reason: { type: String, default: '' },
  fields: [
    {
      name: { type: String },
      value: { type: String },
      status: { type: String, enum: ['approved', 'rejected', 'pending'], default: 'pending' },
      reason: { type: String, default: '' }
    }
  ]
})

const VehicleSchema = mongoose.Schema(
  {
    ownerId: { type: ObjectId, default: null },
    ownerType: {
      type: String,
      default: Enum.ROLES.USER,
      enum: [, Enum.ROLES.USER, Enum.ROLES.ADMIN, Enum.ROLES.COMPANY],
      options: {
        isSearch: true
      }
    },
    userId: { type: ObjectId, ref: 'User', default: null },

    registrationnumber: {
      type: String,
      options: {
        isSearch: true
      },
      default: ''
    },
    makeid: { type: ObjectId, ref: 'makes', default: null },
    model: { type: ObjectId, ref: 'models', default: null },
    year: {
      type: String,
      options: {
        isSearch: true
      },
      default: ''
    },
    color: {
      type: String,
      options: {
        isSearch: true
      },
      default: ''
    },
    servicetype: { type: mongoose.Types.ObjectId, ref: 'ServiceType', default: null },
    status: {
      type: String,
      default: 'inactive',
      options: {
        isSearch: true
      }
    },
    updatedBy: {
      userId: { type: ObjectId },
      role: { type: String }
    },
    capacity: { type: Number, default: 0 },
    document: [Document],
    events: [
      {
        userId: { type: ObjectId },
        userType: { type: String },
        updatedAt: { type: Date },
        description: { type: String }
      }
    ],
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
)

VehicleSchema.pre('save', async function () {
  let eventsArr = []
  const updatedFields = Object.values(this.modifiedPaths())

  if (this.events.length > 0) {
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

VehicleSchema.pre('find', function (next) {
  // remove is a one of the hook here we replace the any particular hook
  this.model().softDeleteMiddleware.bind(this)(next, this._mongooseOptions.queryOptions)
})

VehicleSchema.loadClass(Vehicle)

export default mongoose.model('Vehicle', VehicleSchema)
