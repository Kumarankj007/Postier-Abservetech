/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseValidator } from '../../../validators/BaseValidator.js'

class StripeValidator extends BaseValidator {
  constructor() {
    super()
  }
  static addCard = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          cardNumber: { type: 'string' },
          token: { type: 'string' }
        },
        required: ['cardNumber', 'token']
      }
      const messages = {
        'required:cardNumber': 'Card Number is required',
        'required:token': 'Token is required'
      }
      const validate = await this.ajvCompiler({ schema, data, messages })
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

  static removeCard = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          paymentMethodId: { type: 'string', ObjectId: true }
        },
        required: ['paymentMethodId']
      }
      const messages = {
        'required:paymentMethodId': 'Payment Method Id is required'
      }
      const validate = await this.ajvCompiler({ schema, data, messages })
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

  static chargeCard = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          currency: { type: 'string' },
          amount: { type: 'number' },
          description: { type: 'string' }
        },
        required: ['userId', 'currency', 'amount']
      }
      const messages = {
        'required:paymentMethodId': 'Payment Method Id is required'
      }
      const validate = await this.ajvCompiler({ schema, data, messages })
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

  static connectAccount = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          accountHolderName: { type: 'string', isNotEmpty: true },
          accountHolderType: { type: 'string' /* , isNotEmpty: true*/ },
          accountReference: { type: 'string', isNotEmpty: true },
          accountNumber: { type: 'string', isNotEmpty: true }
        }
        // required: ['accountNumber', 'accountReference', 'accountHolderName']
      }
      const messages = {
        'required:accountNumber': 'Account Number is required',
        'required:accountReference': 'Account Reference is required',
        'required:accountHolderName': 'Account Holder name Id is required'
      }
      const validate = await this.ajvCompiler({ schema, data, messages })
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

  static createTransfer = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          amount: { type: 'string' }
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
}

export { StripeValidator }
