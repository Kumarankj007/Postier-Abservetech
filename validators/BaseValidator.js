/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import Ajv from 'ajv'
import mongoose from 'mongoose'

class BaseValidator {
  static ajvFormater = async (formatObject) => {
    let errorMessages = []
    try {
      const { errors = [], messages = [] } = formatObject
      if (errors && errors.length > 0) {
        for (const error of errors) {
          let schemaPath = error.keyword
          if (error.schemaPath) {
            const schemaPathArr = error.schemaPath.split('/')
            const schemaPathEle = schemaPathArr[1] || ''
            schemaPath = schemaPath == schemaPathEle ? schemaPath : `${schemaPath}:${schemaPathEle}`
          }
          schemaPath = `${schemaPath}:${error.params.missingProperty}`
          errorMessages.push(messages[schemaPath] || error.message)
        }
      }
    } catch (error) {
      errorMessages = [error.message]
    }
    return errorMessages
  }

  static ajvCompiler = async (compileObject) => {
    try {
      const { schema = {}, messages = {}, data = {} } = compileObject
      const ajv = new Ajv({})
      ajv.addKeyword({
        keyword: 'ObjectId',
        type: 'string',
        validate: function validate(schema, data) {
          validate.errors = [
            {
              keyword: 'ObjectId',
              message: 'Parameter is not in the type of ObjectId.',
              params: { keyword: 'ObjectId' }
            }
          ]
          return mongoose.isValidObjectId(data)
        },
        errors: true
      })
      ajv.addKeyword({
        keyword: 'isNotEmpty',
        type: 'string',
        validate: function validate(schema, data) {
          validate.errors = [
            {
              keyword: 'isNotEmpty',
              message: 'Parameter is not empty.',
              params: { keyword: 'isNotEmpty' }
            }
          ]
          return typeof data === 'string' && data.trim() !== ''
        },
        errors: true
      })

      const validate = ajv.compile(schema)
      validate(data)
      const formatError = await this.ajvFormater({ errors: validate.errors, messages: messages })
      return formatError || []
    } catch (error) {
      return [error.message]
    }
  }
}
export { BaseValidator }
