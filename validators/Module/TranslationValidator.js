/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseValidator } from '../BaseValidator.js'

class TranslationValidator extends BaseValidator {
  constructor() {
    super()
  }

  static getTranscribe = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          translationId: { type: 'string', ObjectId: true }
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
    } catch (error) {
      response = {
        status: false,
        message: error.message || 'VALIDATION_FAILED',
        data: {
          validate: error.cause
        }
      }
    }
    return response
  }

  static updateTranscribe = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          // translationId: { type: 'string', ObjectId: true }
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
    } catch (error) {
      response = {
        status: false,
        message: error.message || 'VALIDATION_FAILED',
        data: {
          validate: error.cause
        }
      }
    }
    return response
  }

  static getLanguage = async (data) => {
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
      const validate = await this.ajvCompiler({ schema, data })
      if (validate && validate.length > 0) throw new Error('VALIDATION_FAILED', { cause: validate })
      response = {
        status: true,
        message: 'VALIDATION_SUCCESS',
        data: {}
      }
    } catch (error) {
      response = {
        status: false,
        message: error.message || 'VALIDATION_FAILED',
        data: {
          validate: error.cause
        }
      }
    }
    return response
  }

  static updateLanguage = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' },
          indexName: { type: 'string' },
          status: { type: 'string' }
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
    } catch (error) {
      console.error('UPDATE_LANGUAGE_ERROR:', error)
      response = {
        status: false,
        message: error.message || 'VALIDATION_FAILED',
        data: {
          validate: error.cause
        }
      }
    }
    return response
  }

  static deleteTransaltion = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          translationId: { type: 'string', ObjectId: true }
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
    } catch (error) {
      console.error('UPDATE_LANGUAGE_ERROR:', error)
      response = {
        status: false,
        message: error.message || 'VALIDATION_FAILED',
        data: {
          validate: error.cause
        }
      }
    }
    return response
  }
}

export { TranslationValidator }
