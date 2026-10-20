/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import Mustache from 'mustache'
import { BaseController } from '../BaseController.js'
import { Config } from '../../config/AppConfig.js'
import EmailTemplate from '../../models/Notification/EmailTemplate.js'
import nodemailer from 'nodemailer'
import { MailConfig } from '../../config/MailConfig.js'

import { BadRequestError, NotFoundError } from '../../utils/ErrorHandler.js'
import { RequestHandler } from '../../utils/RequestHandler.js'
import { Logger } from '../../utils/Logger.js'
const logger = new Logger()
const requestHandler = new RequestHandler(logger)

import fs from 'fs'
import path from 'path'

class mailController extends BaseController {
  constructor() {
    super()
  }

  static getConfig = async (req, res) => {
    try {
      const gateway = MailConfig.gateway
      const enabledGateway = gateway.filter(function (e) {
        return e.status === true
      })
      return requestHandler.sendSuccess(req, res, 'GET_PAYMENTCONFIG')({ enabledGateway: enabledGateway })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateConfig = async (req, res) => {
    try {
      const gateway = [...MailConfig.gateway]
      const givenGateway = req.body.mailGateway

      console.log(gateway, 'gateway')
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
      const filePath = `${__dirname}/config/MailConfig.js`
      const fileContent = `
    /* ************************
    * Copyright 2023
    * ABSERVETECH
    ************************ */
   const MailConfig = ${JSON.stringify(
     {
       gateway: gateway
     },
     null,
     2
   )};\nexport { MailConfig };`

      fs.writeFileSync(filePath, fileContent)

      return requestHandler.sendSuccess(req, res, 'CREATE_CONFIG')({ message: 'CREATED', gateway: gateway })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static activegateway = async (req, res) => {
    try {
      const gateway = [...MailConfig.gateway]
      const givenGateway = req.body.mailGateway
      const gatewayStatus = req.body.status

      await gateway.findIndex((data) => {
        if (data.indexName == givenGateway) {
          data.isActive = gatewayStatus
        } else {
          data.isActive = false
        }
      })
      const __dirname = path.resolve()
      const filePath = `${__dirname}/config/MailConfig.js`
      const fileContent = `/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
const MailConfig = ${JSON.stringify(
        {
          gateway: gateway
        },
        null,
        2
      )};
export { MailConfig }`
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
      const mailConfigData = JSON.parse(JSON.stringify(MailConfig.gateway)) || null
      if (!mailConfigData) throw new BadRequestError('CONTACT_ADMIN')
      const activeGatewayIndex = mailConfigData.findIndex((m) => m.isActive)
      if (activeGatewayIndex == -1) throw new BadRequestError('MAIL_GATEWAY_NOT_ACTIVATED')

      const activeGateway =
        mailConfigData[activeGatewayIndex].fields.reduce((acc, { indexName, value }) => {
          return { ...acc, [indexName]: value }
        }, {}) || null
      if (!activeGateway) throw new BadRequestError('GATEWAY_NOT_CONFIGURED')
      activeGateway['gateway'] = mailConfigData[activeGatewayIndex].indexName

      response = {
        status: true,
        message: 'ACTIVE_GATEWAY',
        data: activeGateway
      }
    } catch (error) {
      console.error('GET_ACTIVE_MAIL', error)
      response = {
        status: false,
        message: error.message,
        data: {}
      }
    }
    return response
  }

  static sendMail = async (mailData) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      console.log('mailData', mailData)

      let subject = mailData.data?.subject || ''
      let htmlBody = mailData.data?.description || ''

      const template = await EmailTemplate.findOne({ description: mailData.data?.description })
      console.log('template', template)

      if (template) {
        subject = template.subject
        const renderedTemplate = Mustache.render(template.body, mailData.data?.content)
        htmlBody = template.header + renderedTemplate + '</body></html>' // html body;
        console.log('htmlBody', htmlBody)
      }

      const gatewayData = await this.getActive()
      console.log('gatewayData', gatewayData)

      if (!gatewayData.status) throw new Error(gatewayData.message)

      if (gatewayData.data.gateway == 'gmail' || gatewayData.data.gateway == 'smtp') {
        const smtpConfig = {
          host: gatewayData.data.host,
          port: gatewayData.data.port,
          secure: gatewayData.data.secure,
          auth: {
            user: gatewayData.data.user,
            pass: gatewayData.data.password
          }
        }
        const transporter = nodemailer.createTransport(smtpConfig)
        const mailOptions = {
          from: Config.mailFrom || gatewayData.data.user,
          to: mailData.data?.email,
          subject: subject,
          text: subject,
          html: htmlBody
        }
        console.log('mailOptions', mailOptions)

        transporter.sendMail(mailOptions, (error, info) => {
          console.log('mail process')

          if (error) {
            return console.log(error)
          }
          console.log('info', info)

          console.log('Message sent: %s', info.messageId)
        })
      }

      response = {
        status: true,
        data: {},
        message: 'MAIL_PROCESSED'
      }
    } catch (error) {
      console.log('error', error)

      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }
}

export { mailController }
