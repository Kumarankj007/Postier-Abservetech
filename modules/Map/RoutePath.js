/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'

class RoutePath {
  constructor() {}
}
const lineStringSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['LineString']
    },
    coordinates: {
      type: [[Number]],
      required: true
    }
  },
  { _id: false }
)

const stopPointsSchema = new mongoose.Schema({
  city: { type: String, default: '' },
  coords: { type: [Number], default: [0, 0] }
})

const RoutePathSchema = new mongoose.Schema(
  {
    route: { type: lineStringSchema, index: '2dsphere', default: { type: 'LineString', coordinates: [] } },
    distance: { type: Number, default: 0 },
    distanceText: { type: String, default: '' },
    duration: { type: Number, default: '' },
    durationText: { type: String, default: '' },
    hasTolls: { type: Boolean, default: false },
    overviewPolyline: { type: String, default: '' }, // encoded polyline
    vector: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 }
    },
    stopPoints: [stopPointsSchema]
  },
  { timestamps: true }
)

RoutePathSchema.loadClass(RoutePath)

const RoutePaths = mongoose.model('RoutePaths', RoutePathSchema)
RoutePaths.collection.dropIndexes(['route']).then(() => {
  console.log('------------ ROUTEPATHS Collection Index Dropped ------------')
  RoutePaths.collection
    .createIndexes([{ key: { route: '2dsphere' }, name: 'route' }])
    .then(() => console.log('------------ ROUTEPATHS Collection Index Created ------------'))
})

export default RoutePaths
