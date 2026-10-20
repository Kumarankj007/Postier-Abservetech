/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { BaseController } from '../../controllers/BaseController.js'

import User from './../../models/Auth/User.js'

import Transaction from './models/Transaction.js'
import Merchant from './models/Merchant.js'

import { PaymentServices } from './PaymentService.js'
import { PaymentValidator } from '../../validators/Module/PaymentValidator.js'
import { RequestHandler } from '../../utils/RequestHandler.js'
import { Logger } from '../../utils/Logger.js'
import { Enum } from '../../utils/Enum.js'

import { QueryBuilder } from '../../helpers/QueryBuilder.js'
import { PaymentConfig } from '../../config/PaymentConfig.js'
import { BadRequestError, NotFoundError, UnprocessableError } from '../../utils/ErrorHandler.js'

const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class PaymentController extends BaseController {
  constructor() {
    super()
  }

  static getConfig = async (req, res) => {
    try {
      const gateway = PaymentConfig.gateway
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
      const gateway = [...PaymentConfig.gateway]
      const givenGateway = req.body.paymentGateway

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
      const filePath = `${__dirname}/config/PaymentConfig.js`
      const fileContent = `
    /* ************************
    * Copyright 2023
    * ABSERVETECH
    ************************ */
   const PaymentConfig = ${JSON.stringify(
     {
       gateway: gateway
     },
     null,
     2
   )};\nexport { PaymentConfig };`

      fs.writeFileSync(filePath, fileContent)

      return requestHandler.sendSuccess(req, res, 'CREATE_CONFIG')({ message: 'CREATED', gateway: gateway })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static activegateway = async (req, res) => {
    try {
      const gateway = [...PaymentConfig.gateway]
      const givenGateway = req.body.paymentGateway
      const gatewayStatus = req.body.status

      await gateway.findIndex((data) => {
        if (data.indexName == givenGateway) {
          data.isActive = gatewayStatus
        } else {
          data.isActive = false
        }
      })
      const __dirname = path.resolve()
      const filePath = `${__dirname}/config/PaymentConfig.js`
      const fileContent = `/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
const PaymentConfig = ${JSON.stringify(
        {
          gateway: gateway
        },
        null,
        2
      )};
export { PaymentConfig }`
      await fs.writeFileSync(filePath, fileContent)

      return requestHandler.sendSuccess(
        req,
        res,
        'GATEWAY_ACTIVE'
      )({ message: 'ACTIVATED', gateway: gateway })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getTransaction = async (req, res) => {
    try {
      const queryData = req.query
      const validation = await PaymentValidator.getMyTransaction(queryData)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const paramData = req.params
      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObj = {
        userId: mongoose.Types.ObjectId(paramData.merchantId),
        deletedAt: null
      }

      const queryBuilder = await QueryBuilder.getSearchable(Transaction, queryData)
      queryObj = { ...queryObj, ...queryBuilder.queryObject }

      if (paramData.transactionId) {
        queryObj._id = mongoose.Types.ObjectId(paramData.transactionId)
      }
      const transactionCount = await Transaction.find(queryObj, {}).count().exec()

      const transactionList = await Transaction.find(queryObj, {}).skip(skip).limit(perPage).exec()
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_TRANSACTION'
      )({ message: 'LISTED|TRANSACTION', transaction: transactionList, total: transactionCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getMerchant = async (req, res) => {
    try {
      const queryData = req.query
      const validation = await PaymentValidator.getMerchant(queryData)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0
      if (!queryData.userType) queryData.userType = Enum.ROLES.USER
      let queryObject = { deletedAt: null }

      const queryBuilder = await QueryBuilder.getSearchable(Merchant, queryData)
      queryObject = { ...queryObject, ...queryBuilder.queryObject }

      const userPipeline = [
        {
          $lookup: {
            from: 'users',
            let: { userId: '$userId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$userId']
                  }
                }
              },
              {
                $project: {
                  uniCode: 1,
                  fname: 1,
                  lname: 1
                }
              }
            ],
            as: 'userData'
          }
        },
        {
          $unwind: '$userData'
        }
      ]
      const merchantPipeline = [
        {
          $match: queryObject
        },
        ...userPipeline,
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              { $sort: { _id: -1 } },
              { $skip: Number(skip) || 0 },
              { $limit: Number(perPage) || 10 },
              {
                $project: {
                  transactions: 0,
                  payoutMethods: 0,
                  paymentMethods: 0
                }
              }
            ]
          }
        }
      ]
      const findMerchants = await Merchant.aggregate(merchantPipeline).exec()

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_MERCHANT'
      )({
        message: 'LISTED|MEMBER ACCOUNT',
        transaction: findMerchants[0]?.data,
        total: findMerchants[0]?.metadata[0]?.total
      })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static addMerchant = async (req, res) => {
    try {
      const bodyData = req.body
      const validation = await PaymentValidator.addMerchant(bodyData)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const merchantData = await PaymentServices.addMerchant(bodyData)
      return requestHandler.sendSuccess(
        req,
        res,
        'ADD_MERCHANT'
      )({
        message: 'ADDED|MEMBER ACCOUNT',
        merchant: merchantData
      })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getMyAccount = async (req, res) => {
    try {
      const userId = req.auth.userId
      const queryObj = { deletedAt: null }
      queryObj.userId = mongoose.Types.ObjectId(userId)
      const merchantList = await Merchant.findOne(queryObj, { transactions: 0 }).lean().exec()
      if (!merchantList) throw new BadRequestError('ACCOUNT_NOT_EXISTS')
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_MY_ACCOUNT'
      )({
        message: 'LISTED|MY ACCOUNT',
        account: merchantList
      })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static addMerchantTransaction = async (req, res) => {
    try {
      const bodyData = req.body
      const validation = await PaymentValidator.addMerchant(bodyData)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const userId = mongoose.Types.ObjectId(bodyData.userId)
      const userData = await User.findOne({ _id: userId }).lean().exec()
      if (!userData) throw new NotFoundError('NOT_FOUND|USER')

      const merchant = await Merchant.findOne({ userId: userId }, { transactions: 0 }).exec()

      let balance = merchant.balance || 0
      if (bodyData.mode == Enum.PAYMENT.MODE.CREDIT) balance = balance + Number(bodyData.amount)
      else balance = balance - Number(bodyData.amount)

      const memberTransaction = {
        userId: userId,
        userType: bodyData.userType,
        module: bodyData.module,
        referenceId: bodyData.referenceId,
        description: bodyData.description,
        mode: bodyData.mode,
        amount: bodyData.amount,
        balance: balance
      }

      const updateTrnasaction = await PaymentServices.merchantTransaction(memberTransaction)
      if (!updateTrnasaction) throw new BadRequestError('TRANSACTION_NOT_ADDED')

      await Merchant.updateOne({ userId: userId }, { balance: balance })

      return requestHandler.sendSuccess(
        req,
        res,
        'ADD_MERCHANT'
      )({
        message: 'ADDED|MEMBER TRANSACTION'
      })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getMyTransaction = async (req, res) => {
    try {
      const userId = req.auth.userId
      const queryData = req.query
      const validation = await PaymentValidator.getMyTransaction(queryData)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObject = { deletedAt: null }

      let dayStart = null
      let dayEnd = null
      if (queryData.onYear && !queryData.onMonth) {
        dayStart = new Date(queryData.onYear, 0, 1)
        dayEnd = new Date(queryData.onYear, 11, 31, 23, 59, 59, 999)
      } else if (queryData.onMonth && queryData.onYear) {
        // dayStart = new Date(queryData.onYear, queryData.onMonth, 1)
        // dayEnd = new Date(queryData.onYear, queryData.onMonth, 31, 23, 59, 59, 999)
        dayStart = new Date(queryData.onYear, queryData.onMonth - 1, 1)
        const nextMonth = new Date(queryData.onYear, queryData.onMonth, 1)
        dayEnd = new Date(nextMonth - 1)
        dayEnd.setHours(23, 59, 59, 999)
      } else if (queryData.onMonth && !queryData.onYear) {
        throw new BadRequestError('YEAR_IS_REQUIRED')
      }
      if (dayStart && dayEnd) {
        queryObject['createdAt'] = {
          $gte: dayStart, // Start of day
          $lt: dayEnd // End of day
        }
      }
      const merchant = await Merchant.findOne({ userId: userId })
      const queryBuilder = await QueryBuilder.getSearchable(Transaction, queryData)
      queryObject = { ...queryObject, ...queryBuilder.queryObject }

      queryObject.userId = mongoose.Types.ObjectId(userId)
      const transactions = await Transaction.aggregate([
        {
          $match: queryObject
        },
        {
          $project: {
            _id: 1,
            module: 1,
            referenceId: 1,
            description: 1,
            amount: 1,
            mode: 1,
            balance: 1,
            tax: 1,
            createdAt: 1
          }
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $sort: { _id: -1 } }, { $skip: Number(skip) || 0 }, { $limit: Number(perPage) || 10 }]
          }
        }
      ]).exec()
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_MY_TRANSACTION'
      )({
        message: 'LISTED|MY TRANSACTION',
        transactions: transactions[0]?.data,
        availableFunds: merchant?.balance,
        total: transactions[0]?.metadata[0]?.total
      })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getPaymentMethods = async (req, res) => {
    try {
      const { userId, role } = req.auth
      const gateway = PaymentConfig.gateway
      const enabledGateway = gateway.filter((e) => e.status === true && e.isActive == true)
      const merchant = await Merchant.findOne({ userId: userId, userType: role }).lean().exec()
      const availableGateway = []
      for (const gateway of enabledGateway) {
        if (gateway.indexName != Enum.TRIP.PAYMENT_MODE.CASH || role !== Enum.ROLES.USER) {
          let filterMethods = []
          let isAvailable = false
          const iconFile = gateway.fields.find((e) => e.indexName == 'icon')
          if (gateway.indexName == Enum.TRIP.PAYMENT_MODE.CASH) {
            isAvailable = true
          } else {
            if (merchant && merchant.paymentMethods && merchant.paymentMethods.length > 0) {
              filterMethods = merchant.paymentMethods.filter((m) => m.module == gateway.indexName)
              if (filterMethods.length > 0) {
                isAvailable = true
              }
            }
          }
          availableGateway.push({
            name: gateway.name,
            description: gateway.description,
            indexName: gateway.indexName,
            isAvailable: isAvailable,
            details: filterMethods,
            icon: iconFile?.value || 'public/payments/default.png'
          })
        }
      }

      return requestHandler.sendSuccess(req, res, 'GET_PAYMENTCONFIG')({ availableGateway, merchant })
    } catch (error) {
      console.error('GETPAYMENTMETHODS_ERROR', error)
      return requestHandler.sendError(req, res, error)
    }
  }
}

export { PaymentController }
