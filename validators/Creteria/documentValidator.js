/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseValidator } from '../BaseValidator.js'

import { DocumentConfig } from '../../config/DocumentConfig.js'

class documentValidator extends BaseValidator {
  constructor() {
    super()
  }

  static documentValidate = async (data) => {
    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          fieldName: { type: 'string' }
        },
        additionalProperties: false
      }
      const documentIndex = DocumentConfig.user.findIndex((el) => el.indexName == data.fieldName)

      if (documentIndex == -1) throw new Error('Document Not Found')
      const documentData = { ...DocumentConfig.user[documentIndex] }

      for (const document of documentData.fields) {
        if (document.type == 'image') {
          schema.properties[document.indexName] = { type: 'string' }
        } else if (document.type == 'string') {
          schema.properties[document.indexName] = { type: 'string' }
        } else if (document.type == 'date') {
          schema.properties[document.indexName] = { type: 'string' }
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

  static vehicleDocumentValidate = async (data) => {
    console.log('Data', data)

    let response = {
      status: false,
      message: 'VALIDATION_FAILED',
      data: {}
    }
    try {
      const schema = {
        type: 'object',
        properties: {
          fieldName: { type: 'string' }
        },
        additionalProperties: false
      }
      const documentIndex = DocumentConfig.vehicle.findIndex((el) => el.indexName == data.fieldName)

      if (documentIndex == -1) throw new Error('Document Not Found')
      const documentData = { ...DocumentConfig.vehicle[documentIndex] }

      for (const document of documentData.fields) {
        if (document.type == 'image') {
          schema.properties[document.indexName] = { type: 'string' }
        } else if (document.type == 'string') {
          schema.properties[document.indexName] = { type: 'string' }
        } else if (document.type == 'date') {
          schema.properties[document.indexName] = { type: 'string' }
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
          validate: Error.cause || Error.message
        }
      }
    }
    return response
  }
}

export { documentValidator }
