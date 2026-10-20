/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseValidator } from '../BaseValidator.js'

class TripValidator extends BaseValidator {
  constructor() {
    super()
  }

  static createTrip = async (data) => {
    console.log('Data', data)

    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          description: { type: 'string' },
          email: { type: 'string' },
          type: { type: 'string' },
          deliveryType: { type: 'string' },
          pickup: { type: 'string' },
          pickUpCity: { type: 'string' },
          drop: { type: 'string' },
          dropCity: { type: 'string' },
          pickupLng: { type: 'number' },
          pickupLat: { type: 'number' },
          dropLng: { type: 'number' },
          dropLat: { type: 'number' },
          capacity: { type: 'number' },
          maxWeight: { type: 'number' },
          maxWidth: { type: 'number' },
          maxHeight: { type: 'number' },
          maxLength: { type: 'number' },
          dimensionType: { type: 'string' },
          instantBooking: { type: 'string' },
          vehicleId: { type: 'string' },
          avgPrice: { type: 'number' },
          scheduleTime: { type: 'string' },
          wayPointId: { type: 'string' },
          status: { type: 'string' },
          stopPointsArr: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                city: { type: 'string' },
                lng: { type: 'number' },
                lat: { type: 'number' }
              }
            }
          }
        },
        required: ['pickup', 'drop', 'pickupDate', 'avgPrice']
        // additionalProperties: false
      }
      const messages = {
        'required:description': 'description is required',
        'required:email': 'email is required',
        'required:pickup': 'pickup is required',
        'required:drop': 'drop is required',
        'required:startDate': 'startDate is required',
        'required:capacity': 'capacity is required',
        'required:avgPrice': 'avgPrice is required'
      }
      const validate = await this.ajvCompiler({ schema, data, messages })
      if (validate && validate.length > 0) throw new Error('VALIDATION_FAILED', { cause: validate })

      response = {
        status: true,
        message: 'VALIDATION_SUCCESS',
        data: {}
      }
    } catch (Error) {
      response = {
        status: false,
        message: Error.message || 'VALIDATION_FAILED',
        data: {
          validate: Error.cause
        }
      }
    }
    return response
  }

  static updateTrip = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          description: { type: 'string' },
          email: { type: 'string' },
          type: { type: 'string' },
          deliveryType: { type: 'string' },
          pickup: { type: 'string' },
          pickupCity: { type: 'string' },
          drop: { type: 'string' },
          dropCity: { type: 'string' },
          pickupLng: { type: 'number' },
          pickupLat: { type: 'number' },
          dropLng: { type: 'number' },
          dropLat: { type: 'number' },
          capacity: { type: 'number' },
          maxWeight: { type: 'number' },
          maxWidth: { type: 'number' },
          maxHeight: { type: 'number' },
          maxLength: { type: 'number' },
          instantBooking: { type: 'string' },
          vehicleId: { type: 'string' },
          avgPrice: { type: 'number' },
          scheduleTime: { type: 'string' },
          stopPointsArr: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                city: { type: 'string' },
                lng: { type: 'number' },
                lat: { type: 'number' }
              }
            }
          }
        },
        required: []
      }
      const messages = {}
      const validate = await this.ajvCompiler({ schema, data, messages })
      if (validate && validate.length > 0) throw new Error('VALIDATION_FAILED', { cause: validate })

      response = {
        status: true,
        message: 'VALIDATION_SUCCESS',
        data: {}
      }
    } catch (Error) {
      response = {
        status: false,
        message: Error.message || 'VALIDATION_FAILED',
        data: {
          validate: Error.cause
        }
      }
    }
    return response
  }
  static getTrip = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          limit: { type: 'string' },
          page: { type: 'string' }
        },
        additionalProperties: true
      }
      const messages = {}
      const validate = await this.ajvCompiler({ schema, data, messages })
      if (validate && validate.length > 0) throw new Error('VALIDATION_FAILED', { cause: validate })

      response = {
        status: true,
        message: 'VALIDATION_SUCCESS',
        data: {}
      }
    } catch (Error) {
      response = {
        status: false,
        message: Error.message || 'VALIDATION_FAILED',
        data: {
          validate: Error.cause
        }
      }
    }
    return response
  }
}
export { TripValidator }
