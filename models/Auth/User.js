/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import mongoose from 'mongoose'
import { Enum } from '../../utils/Enum.js'

import { Config } from '../../config/AppConfig.js'

class User extends BaseModel {
  constructor() {
    super()
  }
}

const FavLocation = new mongoose.Schema({
  name: { type: String },
  address: { type: String, default: '' },
  city: { type: mongoose.Types.ObjectId, ref: 'City', default: null },
  state: { type: mongoose.Types.ObjectId, ref: 'State', default: null },
  country: { type: mongoose.Types.ObjectId, ref: 'Country', default: null },
  location: { type: [Number], required: true, default: [0, 0], index: '2dsphere' }
})

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

const UserSchema = new mongoose.Schema(
  {
    uniCode: {
      type: String,
      default: '',
      options: {
        isSearch: true
      }
    },

    fname: {
      type: String,
      default: '',
      options: {
        isSearch: true
      }
    },
    lname: {
      type: String,
      default: '',
      options: {
        isSearch: true
      }
    },
    email: {
      type: String,
      default: '',
      options: {
        isSearch: true
      }
    },
    phone: {
      type: String,
      default: '',
      options: {
        isSearch: true
      }
    },
    type: {
      type: String,
      default: 'user',
      // enum: ['user', 'postier'],
      options: {
        isSearch: true
      }
    },
    phoneCode: { type: String, default: '' },
    dob: { type: Date, default: null },
    gender: { type: String, default: 'Male', enum: ['Male', 'Female', 'Others'] },
    profile: { type: String, default: 'public/Auth/Users/default.jpg' },
    city: { type: mongoose.Types.ObjectId, ref: 'City', default: null },
    state: { type: mongoose.Types.ObjectId, ref: 'State', default: null },
    country: { type: mongoose.Types.ObjectId, ref: 'Country', default: null },
    address: { type: String, default: '' },

    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },

    status: {
      type: String,
      default: Enum.USER.STATUS.PENDING,
      enum: [
        Enum.USER.STATUS.PENDING,
        Enum.USER.STATUS.ACTIVE,
        Enum.USER.STATUS.INACTIVE,
        Enum.USER.STATUS.BLOCKED
      ],
      options: {
        isSearch: true
      }
    },
    favouriteLocation: [FavLocation],
    document: [Document],
    loginType: { type: String, default: '' },
    loginId: { type: String, default: '' },
    deviceId: { type: String, default: '' },
    hash: { type: String, default: '' },
    salt: { type: String, default: '' },
    noPassword: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    vehicleCategory: { type: mongoose.Types.ObjectId, ref: 'VehicleCategory', default: null },
    activeVechicle: { type: mongoose.Types.ObjectId, ref: 'Vehicle', default: null },
    curService: { type: mongoose.Types.ObjectId, ref: 'ServiceType', default: null },
    fcmId: { type: String, default: '' },
    online: {
      type: Boolean,
      default: false,
      options: {
        isSearch: true
      }
    },
    ratings: {
      totalValue: { type: Number, default: 0.0 },
      totalCount: { type: Number, default: 0 }
    },
    profilePercentage: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

UserSchema.loadClass(User)

export default mongoose.model('User', UserSchema)
