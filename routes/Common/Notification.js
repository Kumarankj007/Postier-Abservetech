/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import * as express from 'express'
import { Enum } from '../../utils/Enum.js'

import { NotifcationController as Notification } from '../../controllers/Notification/Index.js'
import { mailTemplate } from '../../controllers/Notification/MailTemplate.js'

import { AuthMiddleware } from '../../middlewares/AuthMiddleware.js'
import { mailController } from '../../controllers/Notification/MailGateway.js'
import { smsController } from '../../controllers/Notification/SmsGateway.js'
const { authorize } = AuthMiddleware

const Router = express.Router()
Router.route('/common/notifications')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Notification.getNotification)
  .put(authorize([Enum.ROLES.ADMIN]), Notification.readNotification)
  .delete(authorize([Enum.ROLES.ADMIN]), Notification.deleteNotification)

Router.route('/common/template/:templateId?')
  .post(authorize([Enum.ROLES.ADMIN]), mailTemplate.createTemplate)
  .get(mailTemplate.getTemplates)
  .put(authorize([Enum.ROLES.ADMIN]), mailTemplate.updateTemplate)
  .delete(authorize([Enum.ROLES.ADMIN]), mailTemplate.deleteTemplate)

Router.route('/common/email/testmail').post(mailController.sendMail)
Router.route('/common/email/testsms').post(smsController.sendSms)

Router.route('/common/config/getsmsconfig').get(smsController.getConfig)
Router.route('/common/config/setsmsconfig').post(smsController.updateConfig)
Router.route('/common/config/activesmsgateway').put(smsController.activegateway)

Router.route('/common/config/getmailconfig').get(authorize([Enum.ROLES.ADMIN]), mailController.getConfig)
Router.route('/common/config/setmailconfig').post(authorize([Enum.ROLES.ADMIN]), mailController.updateConfig)
Router.route('/common/config/activemailgateway').put(
  authorize([Enum.ROLES.ADMIN]),
  mailController.activegateway
)

export { Router as Notification }
