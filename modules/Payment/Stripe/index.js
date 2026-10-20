/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import Stripe from 'stripe'

import Merchant from '../models/Merchant.js'
import { StripeValidator } from './StripeValidator.js'
import { PaymentServices } from '../PaymentService.js'
import { RequestHandler } from '../../../utils/RequestHandler.js'
import { Logger } from '../../../utils/Logger.js'
import mongoose from 'mongoose'
import { Enum } from '../../../utils/Enum.js'
import { Config } from '../../../config/AppConfig.js'
import { BadRequestError, NotFoundError, UnprocessableError } from '../../../utils/ErrorHandler.js'
// import { Enum } from '../../../utils/Enum.js'

const logger = new Logger()
const requestHandler = new RequestHandler(logger)

const AddCard = async (req, res) => {
  try {
    const { userId, role } = req.auth
    const bodyData = req.body

    const validation = await StripeValidator.addCard(bodyData)
    if (!validation.status) return requestHandler.sendError(req, res, validation.data)

    let merchant = await Merchant.findOne({ userId: userId, userType: role }).lean().exec()
    if (!merchant) merchant = await PaymentServices.addMerchant({ userId: userId.toString(), userType: role })

    const { data: configData } = await PaymentServices.getActive('STRIPE')
    const description = 'Merchant ' + merchant._id

    const StripeConfig = new Stripe(configData.secretKey)
    const addCustomer = await StripeConfig.customers.create({
      description: description,
      source: bodyData.token
    })

    const updateDetails = {
      referenceId: addCustomer.id,
      module: 'STRIPE',
      description: description,
      details: {
        card: bodyData.cardNumber || 'XXXX'
      }
    }

    const updatePaymentMethods = await PaymentServices.updateMerchantPaymentMethods({
      merchantId: merchant._id,
      updateDetails
    })

    return requestHandler.sendSuccess(
      req,
      res,
      'ADD_CARD'
    )({
      message: 'ADDED|PAYMENT_METHOD',
      merchant: updatePaymentMethods
    })
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return requestHandler.sendError(req, res, new Error('CHECK_STRIPE_DOCUMENT'))
    } else return requestHandler.sendError(req, res, error)
  }
}

const RemoveCard = async (req, res) => {
  try {
    const { userId, role } = req.auth
    const bodyData = req.body

    const validation = await StripeValidator.removeCard(bodyData)
    if (!validation.status) return requestHandler.sendError(req, res, validation.data)

    const merchant = await Merchant.findOne({ userId: userId, userType: role }).lean().exec()
    if (!merchant) throw new NotFoundError('NOT_FOUND|MERCHANT')

    const deletePaymentMethods = await PaymentServices.deleteMerchantPaymentMethods({
      merchantId: merchant._id,
      paymentMethodId: bodyData.paymentMethodId
    })

    return requestHandler.sendSuccess(
      req,
      res,
      'DELETE_CARD'
    )({
      message: 'DELETED|PAYMENT_METHOD',
      merchant: deletePaymentMethods
    })
  } catch (error) {
    console.error('STRIPE_ADDCARD_ERROR', error)
    return requestHandler.sendError(req, res, error)
  }
}

const ChargeCard = async (data) => {
  let response = {
    status: false,
    data: {},
    message: 'UNPROCESSABLE_PAYMENT'
  }
  try {
    const validation = await StripeValidator.chargeCard(data)
    if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
    const { userId, currency, amount, description = '' } = data

    const { data: configData } = await PaymentServices.getActive('STRIPE')
    const StripeConfig = new Stripe(configData.secretKey)
    const charge = await StripeConfig.charges.create({
      amount: amount * 100,
      currency: currency,
      customer: userId,
      description: description
    })
    if (charge.status != 'succeeded') throw new BadRequestError('CHARGE_NOT_SUCCCEDED')

    response = {
      status: true,
      data: {
        referenceId: charge.id,
        amount: charge.amount / 100
      },
      message: 'PAYMENT_SUCCESS'
    }
  } catch (error) {
    console.error('CHARGE_CARD_ERROR', error)
    response = {
      status: false,
      data: {},
      message: error.message || response.message
    }
  }
  return response
}

const generateAccountLink = async (data) => {
  const { connectId, merchantId } = data

  const { data: configData } = await PaymentServices.getActive('STRIPE')
  const StripeConfig = new Stripe(configData.secretKey)

  const accountLink = await StripeConfig.accountLinks.create({
    account: connectId,
    refresh_url: Config.app.baseurl + configData.refreshUrl + '?merchantId=' + merchantId,
    return_url: Config.app.baseurl + configData.returnUrl + '?merchantId=' + merchantId,
    type: 'account_onboarding'
  })

  const updateDetails = {
    referenceId: connectId,
    module: 'STRIPE',
    description: '',
    details: {
      created: accountLink.created,
      expires_at: accountLink.expires_at,
      url: accountLink.url
    }
  }
  updatePaymentMethods = await PaymentServices.updateMerchantPayoutMethods({
    merchantId: merchantId,
    updateDetails
  })

  return accountLink.url
}

const ConnectAccount = async (req, res) => {
  try {
    const { userId, role: userType } = req.auth
    const bodyData = req.body

    const validation = await StripeValidator.connectAccount(bodyData)
    if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

    let merchant = await Merchant.findOne({ userId: userId, userType: userType }).lean().exec()
    if (!merchant)
      merchant = await PaymentServices.addMerchant({ userId: userId.toString(), userType: userType })

    const { data: configData } = await PaymentServices.getActive('STRIPE')
    const StripeConfig = new Stripe(configData.secretKey)
    const existIndex = merchant.payoutMethods?.findIndex((e) => e.module == 'STRIPE' && e.deletedAt == null)
    let connectId = null
    if (existIndex == -1) {
      const connectAccount = await StripeConfig.accounts.create({
        type: 'express', // [custom,express,standard]
        country: 'US', // Country Code ISO 3166-1 alpha-2 country code
        business_type: 'individual', // [company,government_entity,individual,non_profit]
        // capabilities: {
        //   card_payments: {
        //     requested: true
        //   },
        //   transfers: {
        //     requested: true
        //   }
        // },
        metadata: {
          description: 'Merchant - ' + merchant._id
        }
      })
      const updateDetails = {
        referenceId: connectAccount.id,
        module: 'STRIPE',
        description: '',
        details: {}
      }
      await PaymentServices.updateMerchantPayoutMethods({
        merchantId: merchant._id,
        updateDetails
      })
      connectId = connectAccount.id
    } else {
      connectId = merchant.payoutMethods[existIndex].referenceId
    }

    // Get account status
    const getConnectedAccount = await StripeConfig.accounts.retrieve(connectId)
    if (!getConnectedAccount) throw new BadRequestError('CONTACT_ADMIN')
    else if (getConnectedAccount.capabilities.transfers == 'active')
      return requestHandler.sendSuccess(
        req,
        res,
        'ADD_CARD'
      )({
        message: 'ACCOUNT_ALREADY_ADDED',
        // merchant: null,
        accountLink: null,
        redirect: false
      })
    else {
      // For API Supported currencies we can create by directly
      // const addExternalAccount = await StripeConfig.accounts.createExternalAccount(connectId, {
      //   external_account: {
      //     object: 'bank_account',
      //     country: 'US',
      //     currency: 'USD',
      //     account_holder_name: bodyData.accountHolderName,
      //     account_holder_type: bodyData.accountHolderType || 'individual',
      //     routing_number: bodyData.accountReference, // Replace with actual routing number
      //     account_number: bodyData.accountNumber // Replace with actual account number
      //   },
      //   metadata: {
      //     description: 'Merchant - ' + merchant._id
      //   }
      // })
      // const updateDetails = {
      //   referenceId: connectId,
      //   module: 'STRIPE',
      //   description: '',
      //   details: {
      //     bankAccount: addExternalAccount.id,
      //     accountHolderName: bodyData.accountHolderName,
      //     accountHolderType: bodyData.accountHolderType || 'individual',
      //     accountReference: bodyData.accountReference,
      //     accountNumber: bodyData.accountNumber
      //   }
      // }

      // Otherwise use link to add bank
      let accountLinkUrl = null
      // let updatePaymentMethods = null
      if (existIndex != -1) {
        const existLink = merchant.payoutMethods[existIndex]
        if (existLink.details.expires_at > Date.now()) accountLinkUrl = existLink.details.url
      }
      if (!accountLinkUrl) {
        // const accountLink = await StripeConfig.accountLinks.create({
        //   account: connectId,
        //   refresh_url: Config.app.baseurl + configData.refreshUrl + '?merchantId=' + merchant._id,
        //   return_url: Config.app.baseurl + configData.returnUrl + '?merchantId=' + merchant._id,
        //   type: 'account_onboarding'
        // })

        // const updateDetails = {
        //   referenceId: connectId,
        //   module: 'STRIPE',
        //   description: '',
        //   details: {
        //     created: accountLink.created,
        //     expires_at: accountLink.expires_at,
        //     url: accountLink.url
        //   }
        // }
        // updatePaymentMethods = await PaymentServices.updateMerchantPayoutMethods({
        //   merchantId: merchant._id,
        //   updateDetails
        // })
        // console.log('updatePaymentMethods', updatePaymentMethods)

        accountLinkUrl = await generateAccountLink({
          connectId,
          merchantId: merchant._id
        })
      }

      return requestHandler.sendSuccess(
        req,
        res,
        'ADD_CARD'
      )({
        message: 'ACCOUNT|CREATED',
        // merchant: updatePaymentMethods,
        accountLink: accountLinkUrl,
        redirect: true
      })
    }
  } catch (error) {
    console.error('CONNECT_ACCOUNT_ERROR', error)
    if (error instanceof Stripe.errors.StripeError) {
      return requestHandler.sendError(req, res, new Error('CHECK_STRIPE_DOCUMENT'))
    } else return requestHandler.sendError(req, res, error)
  }
}

const RegenerateAccountLink = async (req, res) => {
  try {
    const queryData = req.query
    const { merchantId } = queryData

    const merchant = await Merchant.findOne({ _id: mongoose.Types.ObjectId(merchantId) })
      .lean()
      .exec()
    if (!merchant) throw new NotFoundError('MERCHANT_NOT_FOUND')

    const existIndex = merchant.payoutMethods?.findIndex((e) => e.module == 'STRIPE' && e.deletedAt == null)
    if (existIndex == -1) throw new NotFoundError('PAYOUT_NOT_FOUND')

    const accountLink = await generateAccountLink({
      connectId: merchant.payoutMethods[existIndex].referenceId,
      merchantId
    })

    console.log('REGENERATE_ACCOUNT_LINK', accountLink)
    // res.redirect('https://rebustar.abservetechdemo.com')
    return requestHandler.sendSuccess(
      req,
      res,
      'REGENERATE_ACCOUNT_LINK'
    )({
      message: 'ACCOUNT_LINK_REGENERATED'
    })
  } catch (error) {
    console.error('REGENERATE_ACCOUNT_LINK_ERROR', error)
    if (error instanceof Stripe.errors.StripeError) {
      return requestHandler.sendError(req, res, new Error('CHECK_STRIPE_DOCUMENT'))
    } else return requestHandler.sendError(req, res, error)
  }
}

const AccountLinkActivation = async (req, res) => {
  try {
    const queryData = req.query
    const { merchantId } = queryData

    const merchant = await Merchant.findOne({ _id: mongoose.Types.ObjectId(merchantId) })
      .lean()
      .exec()
    if (!merchant) throw new NotFoundError('MERCHANT_NOT_FOUND')

    const existIndex = merchant.payoutMethods?.findIndex((e) => e.module == 'STRIPE' && e.deletedAt == null)
    if (existIndex == -1) throw new NotFoundError('PAYOUT_NOT_FOUND')

    const updateDetails = {
      module: 'STRIPE',
      status: Enum.PAYMENT.STATUS.APPROVED
    }
    updatePaymentMethods = await PaymentServices.updateMerchantPayoutMethods({
      merchantId: merchantId,
      updateDetails
    })

    // res.redirect('https://rebustar.abservetechdemo.com')
    return requestHandler.sendSuccess(
      req,
      res,
      'ACCOUNT_LINK_ACTIVATION'
    )({
      message: 'ACCOUNT_LINK_REGENERATED'
    })
  } catch (error) {
    console.error('ACCOUNT_LINK_ACTIVATION_ERROR', error)
    return requestHandler.sendError(req, res, error)
  }
}

const CreateTransfer = async (req, res) => {
  try {
    const { userId, role: userType } = req.auth
    const bodyData = req.body

    const validation = await StripeValidator.createTransfer(bodyData)
    if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

    const merchant = await Merchant.findOne({ userId: userId, userType: userType }).lean().exec()
    if (!merchant) throw new NotFoundError('MERCHANT_NOT_FOUND')

    // if (!bodyData.amount || bodyData.amount != '') bodyData.amount = merchant.balance
    // if (bodyData.amount > merchant.balance) throw new Error('AMOUNT_NOT_VALID')

    const existIndex = merchant.payoutMethods?.findIndex((e) => e.module == 'STRIPE' && e.deletedAt == null)
    if (existIndex == -1) throw new BadRequestError('PLEASE_CONNECT_YOUR_ACCOUNT')

    const { data: configData } = await PaymentServices.getActive('STRIPE')
    const StripeConfig = new Stripe(configData.secretKey)
    const transfer = await StripeConfig.transfers.create({
      amount: Number(5) * 100,
      // amount: Number(bodyData.amount) * 100,
      currency: 'USD',
      destination: merchant.payoutMethods[existIndex].referenceId,
      transfer_group: 'ORDER_95'
    })

    const newBalance = Number(merchant.balance) - Number(bodyData.amount) * 100

    const transactionId = await this.createTransaction({
      referenceId: transfer.id,
      userId: merchant.userId,
      userType: merchant.userType,
      mode: 'debit', // enum
      amount: bodyData.amount,
      balance: newBalance
    })

    merchant.transactions = transactionId
    merchant.balance = newBalance
    await merchant.save()
    return requestHandler.sendSuccess(
      req,
      res,
      'ADD_CARD'
    )({
      message: 'TRANSFER|CREATED'
      // transfer
    })
  } catch (error) {
    console.error('CREATE_TRANSFER_ERROR', error)
    if (error instanceof Stripe.errors.StripeError) {
      return requestHandler.sendError(req, res, new Error('CHECK_STRIPE_DOCUMENT'))
    } else return requestHandler.sendError(req, res, error)
  }
}

export {
  AddCard,
  RemoveCard,
  ChargeCard,
  ConnectAccount,
  CreateTransfer,
  RegenerateAccountLink,
  AccountLinkActivation
}
