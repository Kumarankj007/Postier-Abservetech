/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseValidator } from '../BaseValidator.js'

class OfferValidator extends BaseValidator {
  constructor() {
    super()
  }

  static createOffer = async (data) => {
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
          title: { type: 'string' },
          description: { type: 'string' },
          offerImg: { type: 'string' },
          isPromotion: { type: 'string' }
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

  static getOffer = async (data) => {
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

  static updateOffer = async (data) => {
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
          title: { type: 'string' },
          description: { type: 'string' },
          offerImg: { type: 'string' },
          isPromotion: { type: 'string' }
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

  static deleteOffer = async (req, res) => {
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

export { OfferValidator }
