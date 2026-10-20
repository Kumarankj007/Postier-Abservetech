/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import * as express from 'express'
import { Payment } from './Payment/index.js'
import { Enum } from '../utils/Enum.js'

// import { SubscriptionController as Subscription } from '../modules/Subscription/Subscription.js'
// import { AttendanceController as Attendance } from './Attendance/AttendanceController.js'
import { TranslationController as Translation } from './Translation/TranslationController.js'
import { ChatController as Chat } from './Socket/controllers/ChatController.js'

import { AuthMiddleware } from '../middlewares/AuthMiddleware.js'
const { authorize } = AuthMiddleware

import { UploadMiddlewware } from '../middlewares/UploadMiddleware.js'
// const PackageFile = new UploadMiddlewware({ path: './public/package' }).singleFileUpload
const TransaltionFile = new UploadMiddlewware({ path: './public/locale' }).singleFileUpload

const Router = express.Router()

Router.use('/', Payment)

// Router.route('/module/subscription/package/:packageId?')
//   .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), PackageFile, Subscription.addPackage)
//   .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Subscription.getPackage)
//   .put(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), PackageFile, Subscription.updatePackage)
//   .delete(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Subscription.deletePackage)

// Router.route('/module/subscription/purchasePackage/:purchasePackageId?')
//   .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Subscription.addPurchasePackage)
//   .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Subscription.getPurchasePackage)
//   .put(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Subscription.updatePurchasePackage)
//   .delete(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Subscription.deletePurchasePackage)

// Router.route('/module/attendance/:userId?')
//   .get(authorize([Enum.ROLES.ADMIN]), Attendance.getAttendance)
//   .post(authorize([Enum.ROLES.ADMIN]), Attendance.updateAttendance)

Router.route('/module/chat/channel/:channelId?')
  .post(authorize([Enum.ROLES.USER]), Chat.createChannel)
  .get(authorize([Enum.ROLES.USER]), Chat.getChannel)
  .delete(authorize([Enum.ROLES.USER]), Chat.deleteChannels)

Router.route('/module/chat/messages/:channelId?')
  .get(authorize([Enum.ROLES.USER]), Chat.getMessages)
  .delete(authorize([Enum.ROLES.USER]), Chat.deleteMessages)
  .put(authorize([Enum.ROLES.USER]), Chat.updateMessages)

Router.route('/module/translation/language/:languageId?')
  .get(authorize([Enum.ROLES.ADMIN]), Translation.getLanguages)
  .post(authorize([Enum.ROLES.ADMIN]), TransaltionFile, Translation.updateLanguage)
Router.route('/module/translation').get(authorize([Enum.ROLES.ADMIN]), Translation.getTranslation)
Router.route('/module/translation/groups').get(authorize([Enum.ROLES.ADMIN]), Translation.getTranslationGroup)

Router.route('/module/languages/user').get(Translation.getLanguagesForUser)

Router.route('/module/translation/transcribe/generate').post(
  authorize([Enum.ROLES.ADMIN]),
  Translation.generateJson
)
Router.route('/module/translation/transcribe/:translationId?')
  .get(authorize([Enum.ROLES.ADMIN]), Translation.getTranscribe)
  .post(authorize([Enum.ROLES.ADMIN]), Translation.updateTranscribe)

export { Router as SubscriptionModule }
