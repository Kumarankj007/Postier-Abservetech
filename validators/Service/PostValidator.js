/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseValidator } from '../BaseValidator.js'

class PostValidator extends BaseValidator {
  constructor() {
    super()
  }
  static createPost = async (data) => {
    console.log('data', data)

    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          pickupAddress: { type: 'string' },
          dropAddress: { type: 'string' },
          status: { type: 'string' },
          pickupLat: { type: 'string' },
          pickupLng: { type: 'string' },
          type: { type: 'string' },
          heightType: { type: 'string' },
          height: { type: 'string' },
          widthType: { type: 'string' },
          width: { type: 'string' },
          lengthType: { type: 'string' },
          length: { type: 'string' },
          deliverBy: { type: 'string' },
          pickupDate: { type: 'string' },
          deliveryDate: { type: 'string' },
          dimensionType: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          country: { type: 'string' },
          pincode: { type: 'string' },
          pickUpCity: { type: 'string' },
          dropCity: { type: 'string' },
          country: { type: 'string' },
          isPrivateImage: { type: 'string' },
          isScheduleLater: { type: 'string', nullable: true },
          scheduleTime: { type: 'string', nullable: true }
        },
        required: ['pickupAddress', 'dropAddress', 'pickupLat', 'pickupLng', 'dropLat', 'dropLng'],
        if: {
          properties: { isScheduleLater: { const: 'true' } }
        },
        then: {
          required: ['scheduleTime']
        }
      }
      const messages = {
        'required:pickupAddress': 'pickupAddress is required',
        'required:dropAddress': 'dropAddress is required',
        'required:pickupLat': 'pickupLat is required',
        'required:pickupLng': 'pickupLng is required',
        'required:dropLat': 'dropLat is required',
        'required:dropLng': 'dropLng is required'
      }
      const validate = await this.ajvCompiler({ schema, data, messages })
      console.log('validate', validate)

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

  static createParcel = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string' },
          heightType: { type: 'string' },
          height: { type: 'string' },
          widthType: { type: 'string' },
          width: { type: 'string' },
          apprxSize: { type: 'string' },
          size: { type: 'string' }
        },
        required: [
          'title',
          'description',
          'type',
          'height',
          'heightType',
          'widthType',
          'width',
          'apprxSize',
          'size'
        ]
      }
      const messages = {
        'required:title': 'title is required',
        'required:description': 'description is required',
        'required:type': 'type is required',
        'required.heightType': 'heightType is required',
        'required.widthType': 'widthType is required',
        'required.apprxSize': 'apprxSize is required',
        'required:height': 'height is required',
        'required:width': 'width is required',
        'required:size': 'size is required'
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

  static createReceiverData = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          recvrFname: { type: 'string' },
          recvrLname: { type: 'string' },
          recvrEmail: { type: 'string' },
          recvrPhone: { type: 'string' },
          recvrPhonecode: { type: 'string' },
          recvrAddress: { type: 'string' }
        },
        required: ['recvrFname', 'recvrLname', 'recvrEmail', 'recvrPhone', 'recvrPhonecode']
      }
      const messages = {
        'required:recvrFname': 'recvrFname is required',
        'required:recvrLname': 'recvrLname is required',
        'required:recvrEmail': 'recvrEmail is required',
        'required:recvrPhone': 'recvrPhone is required',
        'required:recvrPhonecode': 'recvrPhonecode is required',
        'required:recvraddress': 'recvraddress is required'
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

  static updatePost = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          pickupAddress: { type: 'string' },
          dropAddress: { type: 'string' },
          pickupLat: { type: 'string' },
          pickupLng: { type: 'string' },
          type: { type: 'string' },
          heightType: { type: 'string' },
          height: { type: 'string' },
          widthType: { type: 'string' },
          width: { type: 'string' },
          lengthType: { type: 'string' },
          length: { type: 'string' },
          deliverBy: { type: 'string' },
          pickupDate: { type: 'string' },
          deliveryDate: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          state: { type: 'string' },
          country: { type: 'string' },
          pincode: { type: 'string' },
          pickupCity: { type: 'string' },
          dropCity: { type: 'string' },
          country: { type: 'string' },
          isScheduleLater: { type: 'string', nullable: true },
          scheduleTime: { type: 'string', nullable: true }
        },
        required: ['']
      }
      const messages = {
        'required:action': 'action is required'
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

  static getPost = async (data, param) => {
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
          sortOrder: { type: 'string' },
          status: { type: 'string' },
          startLng: { type: 'string' },
          startLat: { type: 'string' },
          endLng: { type: 'string' },
          endLat: { type: 'string' },
          pickupDate: { type: 'string' },
          deliveryDate: { type: 'string' }
        },
        additionalProperties: false
      }
      if (!param.postId) {
        schema.required = ['limit', 'page']
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

  static deletePost = async (req, res) => {
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
export { PostValidator }
