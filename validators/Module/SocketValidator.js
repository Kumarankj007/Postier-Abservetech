/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseValidator } from '../BaseValidator.js'

class SocketValidator extends BaseValidator {
  constructor() {
    super()
  }

  static getChannel = async (data) => {
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
          page: { type: 'string' },
          channelId: { type: 'string', ObjectId: true }
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

export { SocketValidator }
