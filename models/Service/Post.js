/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import mongoose from 'mongoose'
import autoIncrement from '../../utils/AutoIncrement.js'
import { Config } from '../../config/AppConfig.js'
import { Enum } from '../../utils/Enum.js'
autoIncrement.initialize(mongoose)
class Post extends BaseModel {
  constructor() {
    super()
  }
}

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
  category: {
    type: String,
    enum: [
      Enum.TRIP.STATUS.REQUESTED,
      Enum.TRIP.STATUS.ACCEPTED,
      Enum.TRIP.STATUS.TRANSIT,
      Enum.TRIP.STATUS.FINISHED,
      Enum.TRIP.STATUS.CANCELLED,
      Enum.TRIP.STATUS.DECLINED
    ],
    default: Enum.TRIP.STATUS.REQUESTED
  },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
})

const location = new mongoose.Schema(
  {
    pickUp: { type: String, default: '' },
    pickUpCity: { type: String, default: '' },
    pickUpPlaceId: { type: String, default: '' },
    drop: { type: String, default: '' },
    dropCity: { type: String, default: '' },
    dropPlaceId: { type: String, default: '' },
    startCoords: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], required: true, default: [0, 0], index: '2dsphere' }
    },
    endCoords: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], required: true, default: [0, 0], index: '2dsphere' }
    }
  },
  { _id: false }
)

const userInfo = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    phoneCode: { type: String, default: Config.app.phoneCode || '+91' },
    address: { type: String, default: '' },
    profile: { type: String, default: 'public/Auth/Users/default.jpg' },
    status: {
      type: String,
      default: Enum.TRIP.STATUS.PUBLISHED,
      enum: [Enum.TRIP.STATUS.PENDING, Enum.TRIP.STATUS.PUBLISHED]
    },
    ratings: {
      totalValue: { type: Number, default: 0.0 },
      totalCount: { type: Number, default: 0 }
    },
    favAddressId: { type: mongoose.Types.ObjectId, default: null },
    country: { type: String, default: '' },
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    pinCode: { type: Number, default: 0 },
    deliveryCode: { type: Number }
  },
  { _id: false }
)

const parcel = new mongoose.Schema(
  {
    type: { type: String, default: '' },
    // heightType: { type: String, default: '' },
    height: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    desc: { type: String, default: '' },
    // widthType: { type: String, default: '' },
    width: { type: Number, default: 0 },
    // lengthType: { type: String, default: '' },
    length: { type: Number, default: 0 },
    dimensionType: { type: String, default: 'Centi-Meter', enum: ['Centi-Meter', 'Inch'] },
    image: [
      {
        primaryImage: { type: String, default: '' },
        topviewImage: { type: String, default: '' },
        frontviewImage: { type: String, default: '' },
        sideviewImage: { type: String, default: '' }
      }
    ],
    isPrivateImage: { type: String, default: 'no', enum: ['yes', 'no'] },
    fare: { type: Number, default: 1 },
    tripPayable: { type: Number, default: 0 }, // drivers amount
    commisonAmount: { type: Number, default: 0 }, // admins amount
    taxAmount: { type: Number, default: 0 }, // government taxes
    deliveryType: { type: String, default: '' },
    pickupDate: { type: Date, default: null },
    deliveryDate: { type: Date, default: null }
  },
  { _id: false }
)

const PostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
    tripId: { type: mongoose.Types.ObjectId, ref: 'Trip', default: null },
    status: {
      type: String,
      default: Enum.TRIP.STATUS.PENDING,
      enum: [
        Enum.TRIP.STATUS.PENDING,
        Enum.TRIP.STATUS.PUBLISHED,
        Enum.TRIP.STATUS.ACCEPTED,
        Enum.TRIP.STATUS.DECLINED,
        Enum.TRIP.STATUS.PICKEDUP,
        Enum.TRIP.STATUS.TRANSIT,
        Enum.TRIP.STATUS.DELIVERED,
        Enum.TRIP.STATUS.RECEIVED
      ]
    },
    location: location,
    consignor: { type: userInfo, default: {} },
    consignee: { type: userInfo, default: {} },
    parcel: parcel,
    wayPointId: { type: mongoose.Types.ObjectId, ref: 'RoutePath', default: null },
    scheduleLater: {
      status: { type: Boolean, default: false },
      time: { type: Date, default: null }
    },
    paymentStatus: {
      type: String,
      default: Enum.TRIP.PAYMENT_STATUS.UNPAID,
      enum: [Enum.TRIP.PAYMENT_STATUS.PAID, Enum.TRIP.PAYMENT_STATUS.UNPAID]
    },
    paymentMethod: {
      type: String,
      default: Enum.TRIP.PAYMENT_MODE.CASH,
      enum: [Enum.TRIP.PAYMENT_MODE.CARD, Enum.TRIP.PAYMENT_MODE.CASH, Enum.TRIP.PAYMENT_MODE.STRIPE]
    },
    pickUpCode: { type: Number },
    events: [eventSchema],
    declinedRequests: { type: [mongoose.Types.ObjectId], default: [] },
    suggestionId: { type: mongoose.Types.ObjectId, default: null },
    deletedAt: { type: Date, default: null },
    referenceNo: {
      type: String,
      default: '',
      options: {
        isSearch: true
      }
    },
    consignmentNo: { type: String, default: '' },
    invoiceNo: { type: String, default: '' }
  },
  { timestamps: true }
)

PostSchema.loadClass(Post)

PostSchema.plugin(autoIncrement.plugin, {
  model: 'Post',
  field: 'referenceNo',
  startAt: 1000,
  incrementBy: 1,
  options: {
    isSearch: true
  }
})
const Posts = mongoose.model('Post', PostSchema)
Posts.collection.dropIndexes(['location.startCoords', 'location.endCoords']).then(() => {
  console.log('------------ POST Collection Index Dropped ------------')
  Posts.collection
    .createIndexes([
      { key: { 'location.startCoords': '2dsphere' }, name: 'location.startCoords' },
      { key: { 'location.endCoords': '2dsphere' }, name: 'location.endCoords' }
    ])
    .then(() => console.log('------------ POST Collection Index Created ------------'))
})

export default Posts
