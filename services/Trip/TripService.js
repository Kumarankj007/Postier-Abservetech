/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { NotFoundError } from '../../utils/ErrorHandler'
import { BaseService } from '../BaseService'
import Trip from '../../models/Service/Trip'

class TripService extends BaseService {
  static updateEvents = async (eventData) => {
    let response = {
      status: false,
      message: 'Unprocessable',
      data: {}
    }
    try {
      const { tripId, postId, event } = eventData

      if (!userId) {
        throw new NotFoundError('NOT_EXIST|USERID')
      }

      const updatedTripEvents = await Trip.findOneAndUpdate(
        { _id: tripId },
        { $push: { events: event } },
        { new: true, runValidators: true }
      )

      const updatedPostTripEvents = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { events: event } },
        { new: true, runValidators: true }
      )

      response = {
        status: true,
        message: 'Updated',
        data: {
          trip: updatedTripEvents,
          post: updatedPostTripEvents
        }
      }
    } catch (error) {
      response = {
        status: false,
        message: error.message,
        data: {}
      }
    }
    return response
  }
}

export { TripService }
