/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseModel } from '../BaseModel.js'
import mongoose from 'mongoose'
import { Enum } from '../../utils/Enum.js'

class Trip extends BaseModel {
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

const stopPointsSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  placeId: { type: String, default: '' },
  coords: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true, default: [0, 0], index: '2dsphere' }
  },
  city: { type: String, default: '' },
  fare: { type: Number, default: 0 }
})

const TripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', default: null },
    description: { type: String, default: '' },
    email: { type: String, default: '' },
    uniCode: {
      type: String,
      default: '',
      options: {
        isSearch: true
      }
    },
    type: { type: String, default: '' },
    deliveryType: { type: String, default: null },
    capacity: { type: Number, default: 0 },
    availableCapacity: { type: Number, default: 0 },
    maxWeight: { type: Number, default: 0 },
    maxWidth: { type: Number, default: 0 },
    maxHeight: { type: Number, default: 0 },
    maxLength: { type: Number, default: 0 },
    dimensionType: { type: String, default: 'Centi-Meter', enum: ['Centi-Meter', 'Inch'] },
    instantBooking: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
    scheduleLater: {
      status: { type: Boolean, default: false },
      time: { type: Date, default: null }
    },
    location: location,
    postier: {
      email: { type: String, default: '' },
      fname: { type: String, default: '' },
      lname: { type: String, default: '' },
      phoneCode: { type: String, default: '' },
      phone: { type: String, default: '' },
      profile: { type: String, default: 'public/Auth/Users/default.jpg' },
      status: { type: String, default: '' },
      vehicleDetails: {
        _id: { type: mongoose.Types.ObjectId, ref: 'Vehicle', default: null },
        vehicleType: { type: String, default: '' },
        vehicleFrontImage: { type: String, default: '' },
        vehicleBackImage: { type: String, default: '' }
      },
      ratings: {
        totalValue: { type: Number, default: 0.0 },
        totalCount: { type: Number, default: 0 }
      }
    },
    status: {
      type: String,
      enum: [
        Enum.TRIP.STATUS.PENDING,
        Enum.TRIP.STATUS.PUBLISHED,
        Enum.TRIP.STATUS.TRANSIT,
        Enum.TRIP.STATUS.FINISHED,
        Enum.TRIP.STATUS.CANCELLED
      ],
      default: Enum.TRIP.STATUS.PENDING
    },
    pickupDate: { type: Date, default: null },
    deliveryDate: { type: Date, default: null },
    avgPrice: { type: Number, default: 0 },
    commisonAmount: { type: Number, default: 0 }, // admins amount
    taxAmount: { type: Number, default: 0 }, // government taxes
    payableAmount: { type: Number, default: 0 },
    events: [eventSchema],
    declinedRequests: { type: [mongoose.Types.ObjectId], default: [] },
    wayPointId: { type: mongoose.Types.ObjectId, ref: 'RoutePath', default: null },
    suggestionId: { type: mongoose.Types.ObjectId, default: null },
    deletedAt: { type: Date, default: null },
    stopPoints: [stopPointsSchema]
  },
  { timestamps: true }
)

TripSchema.loadClass(Trip)

const Trips = mongoose.model('Trip', TripSchema)
Trips.collection.dropIndexes(['location.startCoords', 'location.endCoords', 'stopPoints.coords']).then(() => {
  console.log('------------ TRIP Collection Index Dropped ------------')
  Trips.collection
    .createIndexes([
      { key: { 'location.startCoords': '2dsphere' }, name: 'location.startCoords' },
      { key: { 'location.endCoords': '2dsphere' }, name: 'location.endCoords' },
      { key: { 'stopPoints.coords': '2dsphere' }, name: 'stopPoints.coords' }
    ])
    .then(() => console.log('------------ TRIP Collection Index Created ------------'))
})

export default Trips
