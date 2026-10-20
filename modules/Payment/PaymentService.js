/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'
import { BaseService } from '../../services/BaseService.js'

import User from '../../models/Auth/User.js'
import Merchant from './models/Merchant.js'
import Trip from '../../models/Service/Trip.js'
import Post from '../../models/Service/Post.js'

import { Enum } from '../../utils/Enum.js'
import { PaymentConfig } from '../../config/PaymentConfig.js'
import { PaymentValidator } from '../../validators/Module/PaymentValidator.js'
import { ChargeCard } from './Stripe/index.js'
import { BadRequestError, NotFoundError, UnprocessableError } from '../../utils/ErrorHandler.js'
import Transaction from './models/Transaction.js'

class PaymentServices extends BaseService {
  static getActive = async (gateway = null) => {
    let response = {
      status: false,
      message: 'UNPROCESSABLE',
      data: {}
    }
    try {
      const paymentConfigData = JSON.parse(JSON.stringify(PaymentConfig.gateway)) || null
      if (!paymentConfigData) throw new BadRequestError('CONTACT_ADMIN')
      const activeGatewayIndex = paymentConfigData.findIndex((m) =>
        gateway ? gateway == m.indexName : m.isActive
      )
      if (activeGatewayIndex == -1) throw new BadRequestError('PAYMENT_GATEWAY_NOT_ACTIVATED')

      const activeGateway =
        paymentConfigData[activeGatewayIndex].fields.reduce((acc, { indexName, value }) => {
          return { ...acc, [indexName]: value }
        }, {}) || null
      if (!activeGateway) throw new BadRequestError('GATEWAY_NOT_CONFIGURED')
      activeGateway['gateway'] = paymentConfigData[activeGatewayIndex].indexName

      response = {
        status: true,
        message: 'ACTIVE_GATEWAY',
        data: activeGateway
      }
    } catch (error) {
      console.error('GET_ACTIVE_PAYMENT', error)
      response = {
        status: false,
        message: error.message,
        data: {}
      }
    }
    return response
  }

  static addMerchant = async (data) => {
    try {
      const validation = await PaymentValidator.addMerchant(data)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      let userData = null
      const userId = mongoose.Types.ObjectId(data.userId)
      userData = await User.findOne({ _id: userId }).lean().exec()
      if (!userData) throw new NotFoundError('NOT_FOUND|USER')

      const merchant = new Merchant()
      merchant.userId = data.userId
      merchant.userType = data.userType
      const merchantData = await merchant.save()
      return merchantData
    } catch (error) {
      throw error
    }
  }

  static updateMerchantPaymentMethods = async (data) => {
    const { merchantId, updateDetails } = data
    const merchant = await Merchant.findOne({ _id: merchantId }).lean().exec()
    if (!merchant) throw new NotFoundError('NOT_FOUND|MERCHANT')

    const findQuery = {
      _id: merchantId
    }
    let updateQuery = {}
    const findMethod = merchant?.paymentMethods?.findIndex(
      (i) => i.module == updateDetails.module && i.deletedAt == null
    )
    if (findMethod == -1) {
      updateQuery = {
        $push: {
          paymentMethods: updateDetails
        }
      }
    } else {
      updateQuery = {
        $set: {
          'paymentMethods.$.referenceId': updateDetails.referenceId,
          'paymentMethods.$.module': updateDetails.module,
          'paymentMethods.$.description': updateDetails.description,
          'paymentMethods.$.details': updateDetails.details
        }
      }
      findQuery['paymentMethods.module'] = updateDetails.module
    }
    const updateData = await Merchant.findOneAndUpdate(findQuery, updateQuery, { new: true })
    return updateData
  }

  static deleteMerchantPaymentMethods = async (data) => {
    const { merchantId } = data
    const merchant = await Merchant.findOne({ _id: merchantId }).exec()
    if (!merchant) throw new NotFoundError('NOT_FOUND|MERCHANT')

    const findQuery = {
      _id: merchantId
    }
    const updateData = await Merchant.findOneAndDelete(findQuery)
    return updateData
  }

  static updateMerchantPayoutMethods = async (data) => {
    const { merchantId, updateDetails } = data
    const merchant = await Merchant.findOne({ _id: merchantId }).lean().exec()
    if (!merchant) throw new NotFoundError('NOT_FOUND|MERCHANT')

    const findQuery = {
      _id: merchantId
    }
    let updateQuery = {}
    const findMethod = merchant?.payoutMethods?.findIndex(
      (i) => i.module == updateDetails.module && i.deletedAt == null
    )
    if (findMethod == -1) {
      updateQuery = {
        $push: {
          payoutMethods: updateDetails
        }
      }
    } else {
      if (updateDetails.status) {
        updateQuery = {
          $set: {
            'payoutMethods.$.status': updateDetails.status
          }
        }
      } else {
        updateQuery = {
          $set: {
            'payoutMethods.$.referenceId': updateDetails.referenceId,
            'payoutMethods.$.module': updateDetails.module,
            'payoutMethods.$.description': updateDetails.description,
            'payoutMethods.$.status': updateDetails.status,
            'payoutMethods.$.details': updateDetails.details
          }
        }
      }
      findQuery['payoutMethods.module'] = updateDetails.module
    }
    const updateData = await Merchant.findOneAndUpdate(findQuery, updateQuery, { new: true })
    return updateData
  }

  static deleteMerchantPayoutMethods = async (data) => {
    const { merchantId, paymentMethodId } = data
    const merchant = await Merchant.findOne({ _id: merchantId }).exec()
    if (!merchant) throw new NotFoundError('NOT_FOUND|MERCHANT')

    const findQuery = {
      _id: merchantId
    }
    const updateQuery = {
      $set: {
        'payoutMethods.$[elem].deletedAt': new Date()
      }
    }
    const updateData = await Merchant.findOneAndUpdate(findQuery, updateQuery, {
      arrayFilters: [{ 'elem._id': paymentMethodId, 'elem.deletedAt': null }]
    })

    return updateData
  }

  static merchantPayment = async (data) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_PAYMENT'
    }
    try {
      console.log(JSON.stringify(data))

      const {
        userId,
        userType,
        referenceId,
        paymentMethod,
        paymentMethodId,
        amount,
        currency,
        description = ''
      } = data
      const merchant = await Merchant.findOne({ userId: userId, userType: userType }).lean().exec()
      console.log('merchant', merchant)

      if (paymentMethod == 'STRIPE') {
        console.log('ok')

        if (!merchant) throw new NotFoundError('NOT_FOUND|MERCHANT')
        const stripeIndex = merchant?.paymentMethods?.findIndex((i) => i._id.equals(paymentMethodId))
        if (stripeIndex == -1) throw new BadRequestError('ENABLE_PAYMENT_METHOD')
        const stripeInfo = merchant.paymentMethods[stripeIndex]
        const chargeCard = await ChargeCard({
          amount: amount,
          currency: currency,
          userId: stripeInfo.referenceId,
          description: description || referenceId
        })
        if (!chargeCard.status) throw new BadRequestError(chargeCard.message)
        response = {
          status: true,
          data: {
            referenceId: chargeCard.data.referenceId,
            amount: chargeCard.data.amount,
            paymentStatus: true
          },
          message: 'UNPROCESSABLE_PAYMENT'
        }
      } else {
        throw new NotFoundError('PAYMENT_METHOD_NOT_AVAILABLE')
      }
    } catch (error) {
      console.error('MERCHANT_PAYMENT_ERROR', error)
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }

  static merchantTransaction = async (transactionData) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_PAYMENT'
    }
    try {
      const {
        referenceId,
        paymentMode = Enum.PAYMENT.MODE.CREDIT,
        userId,
        userType = Enum.ROLES.USER,
        amount
      } = transactionData

      let merchantData = await Merchant.findOne({ userId, userType }).exec()
      if (!merchantData) merchantData = await this.addMerchant({ userId: userId.toString(), userType })

      // Check for negative cases
      let balance
      if (paymentMode == Enum.PAYMENT.MODE.CREDIT) balance = Number(merchantData.balance) + Number(amount)
      else balance = Number(merchantData.balance) - Number(amount)

      const addTransaction = await Transaction.create({
        referenceId,
        description: '',
        userId,
        userType,
        paymentMode,
        amount,
        balance
      })

      merchantData.lastTransaction = addTransaction._id
      merchantData.balance = balance
      await merchantData.save()

      response = {
        status: true,
        message: 'TRANSACTION_SUCCESSFUL',
        data: merchantData
      }
    } catch (error) {
      console.error('USER_ACCOUNT_LEDGER', error)
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }

  static initializePayment = async (data) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_PAYMENT'
    }
    try {
      const { tripId, postId, paymentMethodId, paymentMethod } = data
      let paymentStatus = Enum.TRIP.PAYMENT_STATUS.UNPAID
      const tripData = await Trip.findOne({ _id: tripId }).exec()
      if (!tripData) throw new NotFoundError('TRIP|NOT_FOUND')
      const postData = await Post.findOne({ _id: postId }).exec()
      if (!postData) throw new NotFoundError('POST|NOT_FOUND')
      // postData.paymentMethod = Enum.TRIP.PAYMENT_MODE.CARD

      if (paymentMethod == Enum.TRIP.PAYMENT_MODE.CASH) {
        postData.paymentMethod = Enum.TRIP.PAYMENT_MODE.CASH
        postData.paymentStatus = Enum.TRIP.PAYMENT_STATUS.PAID
        paymentStatus = Enum.TRIP.PAYMENT_STATUS.PAID
        await postData.save()
      } else if (paymentMethod == Enum.TRIP.PAYMENT_MODE.STRIPE) {
        const merchantPayment = await PaymentServices.merchantPayment({
          userId: postData.userId,
          userType: Enum.ROLES.USER,
          referenceId: postData._id,
          paymentMethod: paymentMethod,
          paymentMethodId: paymentMethodId,
          amount: postData.parcel.fare,
          currency: 'USD',
          description: 'TRIP_PAYMENT' + tripData._id + postData._id
        })
        if (!merchantPayment || !merchantPayment.status) throw new BadRequestError(merchantPayment.message)
        if (merchantPayment.data.paymentStatus) {
          postData.paymentMethod = paymentMethod
          postData.paymentStatus = Enum.TRIP.PAYMENT_STATUS.PAID
          paymentStatus = Enum.TRIP.PAYMENT_STATUS.PAID
          postData.status = Enum.TRIP.STATUS.ACCEPTED
          await postData.save()
        } else {
          throw new BadRequestError('INVALID_PAYMENT')
          // postData.paymentStatus = Enum.TRIP.PAYMENT_STATUS.UNPAID
          // postData.paymentMethod = Enum.TRIP.PAYMENT_MODE.CASH
          // await postData.save()
          // paymentStatus = Enum.TRIP.PAYMENT_STATUS.UNPAID
          // const customer = Customer.findOne({ _id: tripData.customer.id }, { fcmId: 1 }).lean().exec()
          // const partner = Partner.findOne({ _id: tripData.partner.id }, { fcmId: 1 }).lean().exec()
          // await NotifcationController.createNotification({
          //   processType: [Enum.NOTIFICATION.TYPE.PUSHNOTIFICATION],
          //   data: {
          //     pushToken: customer.fcmId,
          //     title: 'Ride',
          //     body: '',
          //     template: 'paymentCustomerFailure',
          //     templateData: {}
          //   }
          // })
          // await NotifcationController.createNotification({
          //   processType: [Enum.NOTIFICATION.TYPE.PUSHNOTIFICATION],
          //   data: {
          //     pushToken: partner.fcmId,
          //     title: 'Ride',
          //     body: '',
          //     template: 'paymentPartnerFailure',
          //     templateData: {}
          //   }
          // })
        }
      } else throw new BadRequestError('INVALID_PAYMENT|METHOD')

      // Settlement to Driver
      // const transactionData = {
      //   referenceId: tripData._id,
      //   paymentMode:
      //     tripData.paymentMethod == Enum.TRIP.PAYMENT_MODE.CASH
      //       ? Enum.PAYMENT.MODE.DEBIT
      //       : Enum.PAYMENT.MODE.CREDIT,
      //   userId: tripData.partner.id,
      //   userType: Enum.ROLES.PARTNER,
      //   amount:
      //     tripData.paymentMethod == Enum.TRIP.PAYMENT_MODE.CASH
      //       ? tripData.invoice.commision
      //       : tripData.invoice.payable
      // }
      // const transferAmountToPartner = await PaymentServices.merchantTransaction(transactionData)
      // if (!transferAmountToPartner.status) {
      //   throw new Error(transferAmountToPartner.message)
      // }
      response = {
        status: true,
        data: {
          postData,
          tripData,
          paymentStatus: paymentStatus
        },
        message: 'PAYMENT_SUCCESS'
      }
    } catch (error) {
      console.error('INITIALIZE_PAYMENT_ERROR', error)
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }
}

export { PaymentServices }
