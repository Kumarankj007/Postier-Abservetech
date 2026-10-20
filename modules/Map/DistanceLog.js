/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'

class DistanceLogs {
  constructor() {}
}

const DistanceLogsSchema = new mongoose.Schema(
  {
    originLabel: { type: String }, // Origin Address
    destinationLabel: { type: String }, // Destination Address
    origin: { type: Array }, // Origin Coordinates
    destination: { type: Array }, // Destination Coordinates
    distanceValue: { type: Number }, // Distance in meters
    distanceLabel: { type: String }, // Textual representation of distance
    timeValue: { type: Number }, // Time in seconds
    timeLabel: { type: String }, // Textual representation of time
    routePathId: { type: mongoose.Types.ObjectId, ref: 'RoutePath', default: null },
    routePathIds: { type: [mongoose.Types.ObjectId], ref: 'RoutePath', default: [] }
  },
  { timestamps: true }
)

DistanceLogsSchema.loadClass(DistanceLogs)

export default mongoose.model('DistanceLogs', DistanceLogsSchema)
