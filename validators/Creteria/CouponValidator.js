/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseValidator } from '../BaseValidator.js'

class CouponValidator extends BaseValidator {
  constructor() {
    super()
  }

  static addCoupon = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          code: { type: 'string' },
          start: { type: 'string' },
          end: { type: 'string' },
          limit: { type: 'number' },
          userLimit: { type: 'number' },
          fare: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              value: { type: 'number' }
            }
          },
          offerValue: { type: 'number' },
          offerLimit: { type: 'number' },
          // status: { type: 'boolean' },
          startTime: { type: 'string' },
          endTime: { type: 'string' },
          // scIds: { type: 'array' },
          tripType: { type: 'array' },
          applyType: { type: 'string', enum: ['Manual', 'Auto'] }
        }
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

  static getCoupon = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          _sort: { type: 'string' },
          _order: { type: 'string' }
        }
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

  static updateCoupon = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          start: { type: 'string' },
          end: { type: 'string' },
          limit: { type: 'number' },
          userLimit: { type: 'number' },
          fare: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              value: { type: 'number' }
            }
          },
          offerValue: { type: 'number' },
          offerLimit: { type: 'number' },
          // status: { type: 'boolean' },
          startTime: { type: 'string' },
          endTime: { type: 'string' },
          // scIds: { type: 'array' },
          tripType: { type: 'array' },
          applyType: { type: 'string' }
        }
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

  static deleteCoupon = async (req, res) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const body = req.body
      const _id = req.params._id
      body._id = _id

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

export { CouponValidator }
