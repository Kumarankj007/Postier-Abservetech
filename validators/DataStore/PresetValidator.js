/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseValidator } from '../BaseValidator.js'

class PresetValidator extends BaseValidator {
  constructor() {
    super()
  }

  static getLanguageExists = async (data) => {
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
          name: { type: 'string' }
        },
        additionalProperties: false,
        oneOf: [{ required: ['code'] }, { required: ['name'] }],
        additionalProperties: false
      }
      const messages = {
        'required:oneOf:code': 'code is required',
        'required:oneOf:name': 'name is required'
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

  static createLanguage = async (data) => {
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
          name: { type: 'string' }
        },
        required: ['code', 'name']
        // anyOf: [
        //     {
        //         "required": ["phone", "phoneCode"]
        //     },
        //     {
        //         "required": ["email"],
        //         "propertyNames": {"not": {"enum": ["phone", "phoneCode"] } }
        //     }
        // ]
        // additionalProperties: false
      }
      const messages = {
        'required:code': 'code is required',
        'required:name': 'name is required'
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
          code: { type: 'string' },
          name: { type: 'string' }
        },
        required: ['code', 'name']
        // anyOf: [
        //     {
        //         "required": ["phone", "phoneCode"]
        //     },
        //     {
        //         "required": ["email"],
        //         "propertyNames": {"not": {"enum": ["phone", "phoneCode"] } }
        //     }
        // ]
        // additionalProperties: false
      }
      const messages = {
        'required:code': 'code is required',
        'required:name': 'name is required'
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

  // Country
  static getCountryExists = async (data) => {
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
          code: { type: 'string' },
          phonecode: { type: 'string' }
        },
        additionalProperties: false,
        oneOf: [{ required: ['name'] }, { required: ['code'] }, { required: ['phonecode'] }],
        additionalProperties: false
      }
      const messages = {
        'required:oneOf:name': 'name is required',
        'required:oneOf:code': 'code is required',
        'required:oneOf:phonecode': 'PhoneCode is required'
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

  static createCountry = async (data) => {
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
          code: { type: 'string' },
          phonecode: { type: 'string' }
        },
        required: ['name', 'code', 'phonecode']
        // anyOf: [
        //     {
        //         "required": ["phone", "phoneCode"]
        //     },
        //     {
        //         "required": ["email"],
        //         "propertyNames": {"not": {"enum": ["phone", "phoneCode"] } }
        //     }
        // ]
        // additionalProperties: false
      }
      const messages = {
        'required:name': 'name is required',
        'required:code': 'code is required',
        'required:phonecode': 'Phonecode is required'
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

  static updateCountry = async (data) => {
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
          code: { type: 'string' },
          phonecode: { type: 'string' }
        },
        required: ['name', 'code', 'phonecode']
        // anyOf: [
        //     {
        //         "required": ["phone", "phoneCode"]
        //     },
        //     {
        //         "required": ["email"],
        //         "propertyNames": {"not": {"enum": ["phone", "phoneCode"] } }
        //     }
        // ]
        // additionalProperties: false
      }
      const messages = {
        'required:name': 'name is required',
        'required:code': 'code is required',
        'required:phonecode': 'Phonecode is required'
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

  // state
  static getStateExists = async (data) => {
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
          code: { type: 'string' }
        },
        additionalProperties: false,
        oneOf: [{ required: ['name'] }, { required: ['code'] }],
        additionalProperties: false
      }
      const messages = {
        'required:oneOf:name': 'name is required',
        'required:oneOf:code': 'code is required'
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

  static createState = async (data) => {
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
          code: { type: 'string' }
        },
        required: ['name', 'code']
        // anyOf: [
        //     {
        //         "required": ["phone", "phoneCode"]
        //     },
        //     {
        //         "required": ["email"],
        //         "propertyNames": {"not": {"enum": ["phone", "phoneCode"] } }
        //     }
        // ]
        // additionalProperties: false
      }
      const messages = {
        'required:name': 'name is required',
        'required:code': 'code is required'
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

  static updateState = async (data) => {
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
          code: { type: 'string' }
        },
        required: ['name', 'code']
        // anyOf: [
        //     {
        //         "required": ["phone", "phoneCode"]
        //     },
        //     {
        //         "required": ["email"],
        //         "propertyNames": {"not": {"enum": ["phone", "phoneCode"] } }
        //     }
        // ]
        // additionalProperties: false
      }
      const messages = {
        'required:name': 'name is required',
        'required:code': 'code is required'
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

  // city
  static getCityExists = async (data) => {
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
          name: { type: 'string' },
          state_id: { type: 'string' }
        },
        additionalProperties: false,
        oneOf: [{ required: ['code'] }, { required: ['name'] }, { required: ['state_id'] }],
        additionalProperties: false
      }
      const messages = {
        'required:oneOf:code': 'code is required',
        'required:oneOf:name': 'name is required',
        'required:oneOf:state_id': 'StateID is required'
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

  static createCity = async (data) => {
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
          name: { type: 'string' },
          state_id: { type: 'string' }
        },
        required: ['code', 'name', 'state_id']
        // anyOf: [
        //     {
        //         "required": ["phone", "phoneCode"]
        //     },
        //     {
        //         "required": ["email"],
        //         "propertyNames": {"not": {"enum": ["phone", "phoneCode"] } }
        //     }
        // ]
        // additionalProperties: false
      }
      const messages = {
        'required:code': 'code is required',
        'required:name': 'name is required',
        'required:state_id': 'StateID is required'
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

  static updateCity = async (data) => {
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
          name: { type: 'string' },
          state_id: { type: 'string' }
        },
        required: ['code', 'name', 'state_id']
        // anyOf: [
        //     {
        //         "required": ["phone", "phoneCode"]
        //     },
        //     {
        //         "required": ["email"],
        //         "propertyNames": {"not": {"enum": ["phone", "phoneCode"] } }
        //     }
        // ]
        // additionalProperties: false
      }
      const messages = {
        'required:code': 'code is required',
        'required:name': 'name is required',
        'required:state_id': 'StateID is required'
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

  // make
  static getMakeExists = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        additionalProperties: false,
        oneOf: [{ required: ['name'] }],
        additionalProperties: false
      }
      const messages = {
        'required:oneOf:name': 'name is required'
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

  static createMake = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
        // anyOf: [
        //     {
        //         "required": ["phone", "phoneCode"]
        //     },
        //     {
        //         "required": ["email"],
        //         "propertyNames": {"not": {"enum": ["phone", "phoneCode"] } }
        //     }
        // ]
        // additionalProperties: false
      }
      const messages = {
        'required:makeename': 'name is required'
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

  static updateMake = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          name: { type: 'string' }
        },
        required: ['name']
        // anyOf: [
        //     {
        //         "required": ["phone", "phoneCode"]
        //     },
        //     {
        //         "required": ["email"],
        //         "propertyNames": {"not": {"enum": ["phone", "phoneCode"] } }
        //     }
        // ]
        // additionalProperties: false
      }
      const messages = {
        'required:name': 'name is required'
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

  // model
  static getModelExists = async (data) => {
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
          year: { type: 'string' },
          make_id: { type: 'string' }
        },
        additionalProperties: false,
        oneOf: [{ required: ['name'] }, { required: ['year'] }, { required: ['make_id'] }],
        additionalProperties: false
      }
      const messages = {
        'required:oneOf:name': 'name is required',
        'required:oneOf:year': 'Year is required',
        'required:oneOf:make_id': 'MakeID is required'
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

  static createModel = async (data) => {
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
          year: { type: 'string' },
          make_id: { type: 'string' }
        },
        required: ['name', 'year', 'make_id']
        // anyOf: [
        //     {
        //         "required": ["phone", "phoneCode"]
        //     },
        //     {
        //         "required": ["email"],
        //         "propertyNames": {"not": {"enum": ["phone", "phoneCode"] } }
        //     }
        // ]
        // additionalProperties: false
      }
      const messages = {
        'required:name': 'name is required',
        'required:year': 'Year is required',
        'required:make_id': 'MakeID is required'
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

  static updateModel = async (data) => {
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
          year: { type: 'string' },
          make_id: { type: 'string' }
        },
        required: ['name', 'year', 'make_id']
        // anyOf: [
        //     {
        //         "required": ["phone", "phoneCode"]
        //     },
        //     {
        //         "required": ["email"],
        //         "propertyNames": {"not": {"enum": ["phone", "phoneCode"] } }
        //     }
        // ]
        // additionalProperties: false
      }
      const messages = {
        'required:name': 'name is required',
        'required:year': 'Year is required',
        'required:make_id': 'MakeID is required'
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
  static createCurrency = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          country: { type: 'string', ObjectId: true },
          name: { type: 'string' },
          code: { type: 'string' },
          symbol: { type: 'string' }
        },
        required: ['country', 'name', 'code', 'symbol']
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

  static updateCurrency = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          country: { type: 'string', ObjectId: true },
          name: { type: 'string' },
          code: { type: 'string' },
          symbol: { type: 'string' }
        },
        required: ['country', 'name', 'code', 'symbol']
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
  static createVehicleColor = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          color: { type: 'string' }
        }
      }
      const validate = await this.ajvCompiler({ schema, data })
      console.log(validate)
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

  static updateVehicleColor = async (data) => {
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
          color: { type: 'string' }
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
  static createManufactureYear = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          color: { type: 'string' }
        }
      }
      const validate = await this.ajvCompiler({ schema, data })
      console.log(validate)
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

  static updateManufactureYear = async (data) => {
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
          year: { type: 'string' }
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
  static createFaqCategory = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          category: { type: 'string' },
          display_order: { type: 'string' },
          status: { type: 'string' }
        },
        required: ['category', 'display_order']
      }
      const validate = await this.ajvCompiler({ schema, data })
      console.log(validate)
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
  static updateFaqCategory = async (data) => {
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
          category: { type: 'string' },
          display_order: { type: 'string' },
          status: { type: 'string' }
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
  static createFaq = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          category_id: { type: 'string' },
          display_order: { type: 'string' },
          question: { type: 'string' },
          answer: { type: 'string' }
        },
        required: ['category_id', 'display_order', 'question', 'answer']
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
  static updateFaq = async (data) => {
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
          category_id: { type: 'string' },
          display_order: { type: 'string' },
          question: { type: 'string' },
          answer: { type: 'string' }
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
  static createHelpCategory = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          category: { type: 'string' },
          display_order: { type: 'string' },
          status: { type: 'string' }
        },
        required: ['category', 'display_order']
      }
      const validate = await this.ajvCompiler({ schema, data })
      console.log(validate)
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
  static updateHelpCategory = async (data) => {
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
          category: { type: 'string' },
          display_order: { type: 'string' },
          status: { type: 'string' }
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
  static createHelpTopic = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          category_id: { type: 'string' },
          display_order: { type: 'string' },
          question: { type: 'string' },
          answer: { type: 'string' }
        },
        required: ['category_id', 'display_order', 'question', 'answer']
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
  static updateHelpTopic = async (data) => {
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
          category_id: { type: 'string' },
          display_order: { type: 'string' },
          question: { type: 'string' },
          answer: { type: 'string' }
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
}

export { PresetValidator }
