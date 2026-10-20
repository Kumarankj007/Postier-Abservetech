/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseValidator } from '../BaseValidator.js'
import { Enum } from '../../utils/Enum.js'

class AuthValidator extends BaseValidator {
  constructor() {
    super()
  }

  static loginAdmin = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          email: { type: 'string' },
          phone: { type: 'string' },
          phoneCode: { type: 'string' },
          password: { type: 'string' }
        },
        required: ['password'],
        oneOf: [{ required: ['email'] }, { required: ['phone', 'phoneCode'] }],
        additionalProperties: false
      }
      const messages = {
        'required:oneOf:email': 'Email is required',
        'required:oneOf:phone': 'Phone is required',
        'required:oneOf:phoneCode': 'Phone Code is required'
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

  static createAdmin = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          fname: { type: 'string' },
          lname: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          phoneCode: { type: 'string' },
          group: { type: 'string', ObjectId: true }
        },
        required: ['fname', 'lname', 'password'],
        anyOf: [
          {
            required: ['phone']
          },
          {
            required: ['email'],
            propertyNames: { not: { enum: ['phone', 'phoneCode'] } }
          }
        ]
        // additionalProperties: false
      }
      const messages = {
        'required:anyOf:email': 'email is required',
        'required:anyOf:phone': 'phone is required'
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

  static getAdmin = async (data) => {
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
          _order: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          group: { type: 'string' },
          search: { type: 'string' }
        }
        // required: ["_sort", "_order"],
        // additionalProperties: false
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

  static updateAdmin = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          fname: { type: 'string' },
          lname: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          phoneCode: { type: 'string' },
          group: { type: 'string', ObjectId: true },
          exceptId: { type: 'string', ObjectId: true }
        },
        required: ['exceptId']

        // additionalProperties: false
      }
      const messages = {
        'required:exceptId': 'userId is required'
        /* 'required:anyOf:email': 'email is required',
        'required:anyOf:phone': 'phone is required',
        'required:anyOf:phoneCode': 'phoneCode is required'*/
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

  static deleteAdmin = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          _id: { type: 'string', ObjectId: true }
        },
        required: ['_id']
      }
      const messages = {
        'required:_id': 'userId is required'
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

  static getAdminGroup = async (data) => {
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
          _order: { type: 'string' },
          group: { type: 'string' }
        },
        additionalProperties: false
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

  static createAdminGroup = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          group: { type: 'string' },
          description: { type: 'string' },
          permission: { type: 'array' }
        },
        additionalProperties: false
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

  static loginUser = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          email: { type: 'string' },
          phone: { type: 'string' },
          phoneCode: { type: 'string' },
          password: { type: 'string' },
          userType: { type: 'string' },
          verifyBy: { type: 'string' },
          verifyFrom: { type: 'string' },
          code: { type: 'string' },
          fcmId: { type: 'string' }
        },
        oneOf: [{ required: ['email'] }, { required: ['phone', 'phoneCode'] }],
        additionalProperties: false
      }
      const messages = {
        'required:oneOf:email': 'Email is required',
        'required:oneOf:phone': 'Phone is required',
        'required:oneOf:phoneCode': 'Phone Code is required'
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

  static getUserExists = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          email: { type: 'string' },
          phone: { type: 'string' },
          phoneCode: { type: 'string' }
        },
        additionalProperties: false,
        oneOf: [{ required: ['email'] }, { required: ['phone', 'phoneCode'] }],
        additionalProperties: false
      }
      const messages = {
        'required:oneOf:email': 'Email is required',
        'required:oneOf:phone': 'Phone is required',
        'required:oneOf:phoneCode': 'Phone Code is required'
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

  static createUser = async (data) => {
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
          fname: { type: 'string' },
          lname: { type: 'string' },
          type: { type: 'string' },
          email: { type: 'string' },
          phcode: { type: 'string' },
          phone: { type: 'string' },
          gender: { type: 'string' },
          DOB: { type: 'string' },
          cnty: { type: 'string' },
          cntyname: { type: 'string' },
          state: { type: 'string' },
          statename: { type: 'string' },
          city: { type: 'string' },
          cityname: { type: 'string' },
          loginType: { type: 'string' },
          status: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                curstatus: { type: 'string' }
              }
            }
          },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 16
          }
        },
        required: ['fname', 'lname', 'type', 'password', 'confirmPassword'],
        anyOf: [
          {
            required: ['phone', 'phoneCode']
          },
          {
            required: ['email'],
            propertyNames: { not: { enum: ['phone', 'phoneCode'] } }
          }
        ]
        // additionalProperties: false
      }
      const messages = {
        'required:anyOf:email': 'email is required',
        'required:anyOf:phone': 'phone is required',
        'required:anyOf:phoneCode': 'phoneCode is required'
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

  static getUser = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          _limit: { type: 'string' },
          _page: { type: 'string' }
        }
        // required: ['_limit', '_page']
        // additionalProperties: false
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

  static updateUser = async (data) => {
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
          fname: { type: 'string' },
          lname: { type: 'string' },
          type: { type: 'string' },
          email: { type: 'string' },
          phcode: { type: 'string' },
          phone: { type: 'string' },
          gender: { type: 'string' },
          DOB: { type: 'string' },
          cnty: { type: 'string' },
          cntyname: { type: 'string' },
          state: { type: 'string' },
          statename: { type: 'string' },
          city: { type: 'string' },
          cityname: { type: 'string' },
          loginType: { type: 'string' },
          status: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                curstatus: { type: 'string' }
              }
            }
          }
        }
        // required: ['fname', 'lname', 'type'],
        // anyOf: [
        //   {
        //     required: ['phone', 'phoneCode']
        //   },
        //   {
        //     required: ['email'],
        //     propertyNames: { not: { enum: ['phone', 'phoneCode'] } }
        //   }
        // ]
        // additionalProperties: false
      }
      const messages = {
        // 'required:anyOf:email': 'email is required',
        // 'required:anyOf:phone': 'phone is required',
        // 'required:anyOf:phoneCode': 'phoneCode is required'
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

  static deleteUser = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          exceptId: { type: 'string', ObjectId: true }
        },
        required: ['exceptId']
      }
      const messages = {
        'required:exceptId': 'userId is required'
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

  static changepassword = async (data) => {
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
          email: { type: 'string' },
          phone: { type: 'string' },
          phoneCode: { type: 'string' },
          code: { type: 'string' },
          verifyBy: { type: 'string' },
          userType: { type: 'string' },
          verifyFrom: { type: 'string' },
          password: { type: 'string' },
          oldpassword: { type: 'string' },
          newpassword: { type: 'string' },
          verificationToken: { type: 'string' }
        },
        required: ['password'],
        allOf: [
          {
            if: { not: { required: ['verificationToken'] } },
            then: {
              anyOf: [{ required: ['email'] }, { required: ['phone', 'phoneCode'] }, { required: ['_id'] }]
            }
          }
        ],
        // anyOf: [
        //   { required: ['email'], propertyNames: { not: { enum: ['phone', 'phoneCode'] } } },
        //   { required: ['phone', 'phoneCode'] },
        //   { required: ['_id'] }
        // ],
        additionalProperties: false
      }
      const messages = {
        'required:anyOf:email': 'Email is required',
        'required:anyOf:phone': 'Phone is required',
        'required:anyOf:phoneCode': 'Phone Code is required',
        'required:anyOf:_id': '_id is required'
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

  static setPassword = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          newPassword: { type: 'string' },
          confirmPassword: { type: 'string' }
        },
        required: ['newPassword', 'confirmPassword'],
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

  static verification = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          email: { type: 'string' },
          phone: { type: 'string' },
          phoneCode: { type: 'string' },
          code: { type: 'string' },
          verifyBy: { type: 'string' },
          userType: { type: 'string' },
          verifyFrom: { type: 'string' }
        },
        // oneOf: [{ required: ['email'] }, { required: ['phone', 'phoneCode'] }],
        anyOf: [
          {
            required: ['phone', 'phoneCode']
          },
          {
            required: ['email'],
            propertyNames: { not: { enum: ['phone', 'phoneCode'] } }
          }
        ],
        additionalProperties: false
      }
      const messages = {
        'required:anyOf:email': 'Email is required',
        'required:anyOf:phone': 'Phone is required',
        'required:anyOf:phoneCode': 'Phone Code is required'
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

  static sendOtpverify = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          email: { type: 'string' },
          phoneNumber: { type: 'string' },
          phoneCode: { type: 'string' },
          userType: { type: 'string' },
          verifyBy: { type: 'string' },
          verifyFrom: { type: 'string' }
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

  static getAdminExists = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          email: { type: 'string' },
          phone: { type: 'string' },
          phoneCode: { type: 'string' },
          exceptId: { type: 'string' }
        },
        additionalProperties: false,
        oneOf: [{ required: ['email'] }, { required: ['phone', 'phoneCode'] }],
        additionalProperties: false
      }
      const messages = {
        'required:oneOf:email': 'Email is required',
        'required:oneOf:phone': 'Phone is required',
        'required:oneOf:phoneCode': 'Phone Code is required'
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

  static socialLogin = async (data) => {
    let response = {
      status: false,
      message: 'Validation Failed',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          accessToken: { type: 'string' }
        },
        required: ['accessToken'],
        additionalProperties: true
      }
      const messages = {
        'required:accessToken': 'Access Token is required'
      }
      const validate = await this.ajvCompiler({ schema, data, messages })
      if (validate && validate.length > 0) throw new Error('VALIDATION_FAILED', { cause: validate })
      response = {
        status: true,
        message: 'Validation Success',
        data: {}
      }
    } catch (Error) {
      response = {
        status: false,
        message: Error.message || 'Validation failed',
        data: {
          validate: Error.cause
        }
      }
    }
    return response
  }

  static addFavLocation = async (data) => {
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
          address: { type: 'string' }
        }
      }
      const messages = {
        'required:anyOf:name': 'name is required',
        'required:anyOf:address': 'address is required'
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
        message: Error.message || 'VALIDATION_FAILED',
        data: {
          validate: Error.cause
        }
      }
    }
    return response
  }

  static updateFavLocation = async (data) => {
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
          address: { type: 'string' }
        }
      }
      const messages = {
        'required:anyOf:name': 'name is required',
        'required:anyOf:address': 'address is required'
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
        message: Error.message || 'VALIDATION_FAILED',
        data: {
          validate: Error.cause
        }
      }
    }
    return response
  }

  static deleteFavLocation = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          favouriteLocationId: { type: 'string', ObjectId: true }
        },
        required: ['favLocationId'],
        additionalProperties: true
      }
      const messages = {
        'required:favLocationId': 'favLocationId is required'
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

  static updateUserStatus = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: [
              Enum.USER.STATUS.PENDING,
              Enum.USER.STATUS.ACTIVE,
              Enum.USER.STATUS.INACTIVE,
              Enum.USER.STATUS.BLOCKED
            ]
          }
        },
        required: ['status']
        // additionalProperties: false
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

export { AuthValidator }
