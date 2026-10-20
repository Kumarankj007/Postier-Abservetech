/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseController } from '../BaseController.js'
import { SmsConfig } from '../../config/SmsConfig.js'

import { RequestHandler } from '../../utils/RequestHandler.js'
import { BadRequestError, NotFoundError } from '../../utils/ErrorHandler.js'
import { Logger } from '../../utils/Logger.js'

// import twilio from 'twilio'

import fs from 'fs'
import path from 'path'

const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class smsController extends BaseController {
  constructor() {
    super()
  }

  static getConfig = async (req, res) => {
    try {
      const gateway = SmsConfig.gateway
      const enabledGateway = gateway.filter(function (e) {
        return e.status === true
      })
      return requestHandler.sendSuccess(req, res, 'GET_SMSCONFIG')({ enabledGateway: enabledGateway })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateConfig = async (req, res) => {
    try {
      const gateway = [...SmsConfig.gateway]
      const givenGateway = req.body.smsGateway

      const givenGatewayIndex = gateway.findIndex((data) => data.indexName == givenGateway)
      if (givenGatewayIndex == -1) throw new NotFoundError('GATEWAY|NOT_FOUND')
      const gatewayFields = gateway[givenGatewayIndex].fields
      for (const field of gatewayFields) {
        if (req.body.hasOwnProperty(field.indexName)) {
          field.value = req.body[field.indexName]
        }
      }
      gateway[givenGatewayIndex].fields = gatewayFields

      const __dirname = path.resolve()
      const filePath = `${__dirname}/config/SmsConfig.js`
      const fileContent = `/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
const SmsConfig = ${JSON.stringify(
        {
          gateway: gateway
        },
        null,
        2
      )};
export { SmsConfig }`

      await fs.writeFileSync(filePath, fileContent)

      return requestHandler.sendSuccess(req, res, 'CREATE_CONFIG')({ message: 'CREATED', gateway: gateway })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static activegateway = async (req, res) => {
    try {
      const gateway = [...SmsConfig.gateway]
      const givenGateway = req.body.smsGateway
      const gatewayStatus = req.body.status

      await gateway.findIndex((data) => {
        if (data.indexName == givenGateway) {
          data.isActive = gatewayStatus
        } else {
          data.isActive = false
        }
      })
      const __dirname = path.resolve()
      const filePath = `${__dirname}/config/SmsConfig.js`
      const fileContent = `/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
const SmsConfig = ${JSON.stringify(
        {
          gateway: gateway
        },
        null,
        2
      )};
export { SmsConfig }`
      await fs.writeFileSync(filePath, fileContent)

      return requestHandler.sendSuccess(
        req,
        res,
        'GATEWAY_ACTIVE'
      )({ message: 'ACTIVATED', gateway: gateway })
    } catch (error) {
      console.log(error, 'error')
    }
  }

  static getActive = async () => {
    let response = {
      status: false,
      message: 'UNPROCESSABLE',
      data: {}
    }
    try {
      console.log('getActive')
      const smsConfigData = JSON.parse(JSON.stringify(SmsConfig.gateway)) || null
      if (!smsConfigData) throw new BadRequestError('CONTACT_ADMIN')
      const activeGatewayIndex = smsConfigData.findIndex((m) => m.isActive)
      if (activeGatewayIndex == -1) throw new BadRequestError('SMS_GATEWAY_NOT_ACTIVATED')

      const activeGateway =
        smsConfigData[activeGatewayIndex].fields.reduce((acc, { indexName, value }) => {
          return { ...acc, [indexName]: value }
        }, {}) || null
      if (!activeGateway) throw new BadRequestError('GATEWAY_NOT_CONFIGURED')
      activeGateway['gateway'] = smsConfigData[activeGatewayIndex].indexName

      response = {
        status: true,
        message: 'ACTIVE_GATEWAY',
        data: activeGateway
      }
    } catch (error) {
      console.error('GET_ACTIVE_SMS', error)
      response = {
        status: false,
        message: error.message,
        data: {}
      }
    }
    return response
  }

  static sendSms = async (smsData) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      console.log('---------------')
      if (smsData.phone) {
        smsData.phone = smsData.phone.trim()
      }

      // phCode = '91';
      smsData.phCode = smsData.phCode.toString()
      const isphCode = smsData.phCode.startsWith('+')
      if (!isphCode) smsData.phCode = '+' + smsData.phCode

      const gatewayData = await this.getActive()
      if (!gatewayData.status) throw new BadRequestError(gatewayData.message)
      if (gatewayData.data.gateway == 'twilio') {
        console.log('inside')
        const accountSid = gatewayData.data.accountSid // Your Account SID from www.twilio.com/console
        const authToken = gatewayData.data.authToken // Your Auth Token from www.twilio.com/console
        const twilioNo = gatewayData.data.phoneNo // From a valid Twilio number
        const client = new twilio(accountSid, authToken)
        client.messages
          .create({
            body: smsData.body,
            to: smsData.phCode + smsData.phone, // Text this number
            // body: 'Hello',
            // to: '+916385260362',
            from: twilioNo // From a valid Twilio number
          })
          .then((message) => console.log(message.body, '-----------')) // sid
          .catch((err) => console.log(err))
      }

      response = {
        status: true,
        data: {},
        message: 'SMS_PROCESSED'
      }
    } catch (error) {
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }
}

export { smsController }
