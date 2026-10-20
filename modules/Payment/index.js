/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import * as express from 'express'
import { PaymentController as Payment } from './PaymentController.js'
import * as Stripe from './Stripe/index.js'

import { Enum } from '../../utils/Enum.js'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware.js'
const { authorize } = AuthMiddleware

const Router = express.Router()

Router.route('/module/payment/merchant/:merchantId?')
  .get(authorize([Enum.ROLES.ADMIN]), Payment.getMerchant)
  .post(/* authorize([Enum.ROLES.ADMIN]),*/ Payment.addMerchant)

Router.route('/module/payment/merchantTransaction/:transactionId?')
  // .get(authorize([Enum.ROLES.ADMIN]), Payment.addMerchantTransaction)
  .post(authorize([Enum.ROLES.ADMIN]), Payment.addMerchantTransaction)

Router.route('/module/payment/transactions/:merchantId/:transactionId?').get(
  authorize([Enum.ROLES.ADMIN]),
  Payment.getTransaction
)

Router.route('/module/payment/myAccount').get(authorize([Enum.ROLES.USER]), Payment.getMyAccount)
Router.route('/module/payment/myAccount/transactions').get(
  authorize([Enum.ROLES.USER]),
  Payment.getMyTransaction
)
Router.route('/module/payment/methods').get(authorize([Enum.ROLES.USER]), Payment.getPaymentMethods)

Router.route('/module/payment/methods/stripe/card')
  .post(authorize([Enum.ROLES.USER]), Stripe.AddCard)
  .delete(authorize([Enum.ROLES.USER]), Stripe.RemoveCard)

Router.route('/module/payout/methods/stripe/connect').post(
  authorize([Enum.ROLES.USER]),
  Stripe.ConnectAccount
)

Router.route('/module/payout/methods/stripe/refreshAccountLink').get(Stripe.RegenerateAccountLink)
Router.route('/module/payout/methods/stripe/activateAccountLink').get(Stripe.AccountLinkActivation)

Router.route('/module/payout/methods/stripe/transfer').post(
  authorize([Enum.ROLES.USER]),
  Stripe.CreateTransfer
)

Router.route('/common/config/getpaymentconfig').get(Payment.getConfig)
Router.route('/common/config/setpaymentconfig').post(Payment.updateConfig)
Router.route('/common/config/activepaymentgateway').put(Payment.activegateway)

export { Router as Payment }
