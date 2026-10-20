/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseValidator } from '../BaseValidator.js'

class PricingValidator extends BaseValidator {
  constructor() {
    super()
  }

  static getPricing = async (data) => {
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

  static createPricing = async (data) => {
    console.log('data', JSON.stringify(data))

    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          serviceId: { type: 'string' },
          currencyId: { type: 'string' },
          baseFare: { type: 'string' },
          bookingFare: { type: 'string' },
          fare: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              value: { type: 'string' }
            }
          },
          timeFare: { type: 'string' },
          commision: { type: 'string' },
          minimumFare: { type: 'string' },
          taxFare: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              fare: { type: 'string' }
            }
          },
          waitingFare: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              allowedMin: { type: 'string' },
              fare: { type: 'string' }
            }
          },
          cancelationFare: {
            type: 'object',
            properties: {
              partner: { type: 'string' },
              customer: { type: 'string' }
            }
          }
          // additional: {
          //   type: 'object',
          //   properties: {
          //     peakFare: { type: 'array' },
          //     nightFare: { type: 'array' },
          //     distanceFare: { type: 'array' },
          //     pickupFare: {
          //       type: 'object',
          //       properties: {
          //         status: { type: 'string' },
          //         value: { type: 'string' }
          //       }
          //     }
          //   }
          // }
        }
        // required: ['serviceId'],
        // additionalProperties: false,
      }
      const validate = await this.ajvCompiler({ schema, data })
      if (validate && validate.length > 0) throw new Error('VALIDATION_FAILED', { cause: validate })
      response = {
        status: true,
        message: 'VALIDATION_SUCCESS',
        data: {}
      }
    } catch (Error) {
      console.log('create pricing error :', Error)

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

  static updatePricing = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          serviceId: { type: 'string' },
          baseFare: { type: 'string' },
          bookingFare: { type: 'string' },
          fare: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              value: { type: 'string' }
            }
          },
          minimumFare: { type: 'string' },
          timeFare: { type: 'string' },
          commision: { type: 'string' },
          cancelationFare: {
            type: 'object',
            properties: {
              partner: { type: 'string' },
              customer: { type: 'string' }
            }
          }
          // additional: { type: 'object' }
        }
        // required: ['serviceId'],
        // additionalProperties: false,
      }
      const validate = await this.ajvCompiler({ schema, data })
      console.log('validate', validate)

      if (validate && validate.length > 0) throw new Error('VALIDATION_FAILED', { cause: validate })
      response = {
        status: true,
        message: 'VALIDATION_SUCCESS',
        data: {}
      }
    } catch (Error) {
      console.log(Error)

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

export { PricingValidator }
