/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'

import { BaseController } from '../BaseController.js'
import Coupon from '../../models/Creteria/Coupon.js'
import { RequestHandler } from '../../utils/RequestHandler.js'
import { Logger } from '../../utils/Logger.js'
import { QueryBuilder } from '../../helpers/QueryBuilder.js'
import moment from 'moment'
import { CouponValidator } from '../../validators/Creteria/CouponValidator.js'
import { NotFoundError, UnprocessableError } from '../../utils/ErrorHandler.js'

const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class CouponController extends BaseController {
  constructor() {
    super()
  }

  static addCoupon = async (req, res) => {
    try {
      const body = req.body || {}

      const validation = await CouponValidator.addCoupon(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const newDoc = new Coupon({
        code: body.code,
        start: body.start,
        end: body.end,
        limit: body.limit,
        userLimit: body.userLimit,
        fare: {
          type: body.fare['type'],
          value: body.fare['value']
        },
        offerValue: body.offerValue,
        offerLimit: body.offerLimit,
        status: body.status,
        startTime: body.startTime,
        endTime: body.endTime,
        // scIds: body.scIds && body.scIds != '' ? body.scIds : [],
        tripType: body.tripType,
        applyType: body.applyType,
        category: body.category
      })

      const addCoupon = await newDoc.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'ADD_COUPON'
      )({ message: 'CREATED|COUPON', data: addCoupon })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getCoupon = async (req, res) => {
    try {
      const validation = await CouponValidator.getCoupon(req.query)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const queryData = req.query
      const paramData = req.params
      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      // const queryObj = {}
      let queryObject = {}
      const queryBuilder = await QueryBuilder.getSearchable(Coupon, queryData)
      queryObject = queryBuilder.queryObject

      if (paramData.couponId) queryObject._id = mongoose.Types.ObjectId(paramData.couponId)

      const startDate = queryData.start ? moment(queryData.start) : null
      const endDate = queryData.end ? moment(queryData.end) : null
      if (startDate) queryObject['start'] = startDate.format('YYYY-MM-DD')
      if (endDate) queryObject['end'] = endDate.format('YYYY-MM-DD')

      const getCouponDataCount = await Coupon.find(queryObject).count()
      const getCouponData = await Coupon.find(queryObject).skip(skip).limit(perPage)

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_COUPON'
      )({
        message: 'LISTED|COUPON',
        coupons: getCouponData,
        total: getCouponDataCount
      })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateCoupon = async (req, res) => {
    try {
      const body = req.body
      const couponId = req.params.couponId || req.query.couponId

      const validation = await CouponValidator.updateCoupon(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const coupon = await Coupon.findById(couponId).exec()
      if (!coupon) throw new NotFoundError('NOT_FOUND|COUPON')

      coupon.start = body.start || coupon.start
      coupon.end = body.end || coupon.end
      coupon.limit = body.limit || coupon.limit
      coupon.userLimit = body.userLimit || coupon.userLimit
      coupon.fare.type = body.fare && body.fare.type ? body.fare.type : coupon.fare.type
      coupon.fare.value = body.fare && body.fare.value ? body.fare.value : coupon.fare.value
      coupon.offerValue = body.offerValue || coupon.offerValue
      coupon.offerLimit = body.offerLimit || coupon.offerLimit
      coupon.status = body.status || coupon.status
      coupon.startTime = body.startTime || coupon.startTime
      coupon.endTime = body.endTime || coupon.endTime
      // coupon.scIds = body.scIds && body.scIds != '' ? body.scIds : coupon.scIds
      coupon.tripType = body.tripType || coupon.tripType
      coupon.applyType = body.applyType || coupon.applyType

      const updatedCoupon = await coupon.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_COUPON'
      )({ message: 'UPDATED|COUPON', coupon: updatedCoupon })
    } catch (error) {
      console.error('UPDATE_COUPON_ERROR: ', error)
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteCoupon = async (req, res) => {
    try {
      const body = req.body
      const couponId = req.params.couponId || req.query.couponId
      body._id = couponId

      const deleteCoupon = await Coupon.findById(couponId).remove().exec()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_COUPON'
      )({ message: 'DELETED|COUPON', coupon: deleteCoupon })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }
}

export { CouponController }
