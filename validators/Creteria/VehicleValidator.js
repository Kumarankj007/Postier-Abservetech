/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseValidator } from '../BaseValidator.js'

class VehicleValidator extends BaseValidator {
  constructor() {
    super()
  }

  static getVehicles = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          model: { type: 'string' },
          registrationnumber: { type: 'string' },
          chaisis: { type: 'string' }
        },
        additionalProperties: false
      }
      const validate = await this.ajvCompiler({ schema, data })
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

  static createVehicle = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          registrationnumber: { type: 'string' },
          partnerId: { type: 'string' },
          makeid: { type: 'string' },
          model: { type: 'string' },
          year: { type: 'string' },
          color: { type: 'string' },
          servicetype: { type: 'string' },
          capacity: { type: 'string' },
          ownerId: { type: 'string' },
          ownerType: { type: 'string' }
        },
        additionalProperties: false
      }
      const validate = await this.ajvCompiler({ schema, data })
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

  static updateVehicle = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          registrationnumber: { type: 'string' },
          partnerId: { type: 'string' },
          makeid: { type: 'string' },
          model: { type: 'string' },
          year: { type: 'string' },
          color: { type: 'string' },
          servicetype: { type: 'string' },
          status: { type: 'string' },
          ownerId: { type: 'string' },
          ownerType: { type: 'string' }
        },
        additionalProperties: true
      }
      const validate = await this.ajvCompiler({ schema, data })
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

export { VehicleValidator }
