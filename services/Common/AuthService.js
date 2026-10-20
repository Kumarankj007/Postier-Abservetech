/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'
import { BaseService } from '../BaseService.js'

import Admin from '../../models/Auth/Admin.js'
import AdminGroup from '../../models/Auth/AdminGroup.js'
import User from '../../models/Auth/User.js'
import Trip from '../../models/Service/Trip.js'
import { InvoiceNumber } from 'invoice-number'
import { BadRequestError, NotFoundError } from '../../utils/ErrorHandler.js'

class AuthServices extends BaseService {
  static uniCodeGenerator = async (module) => {
    let response = {
      status: false,
      message: 'UNPROCESSABLE_ENTITY',
      data: {}
    }
    try {
      const allowedModule = ['Customer', 'Provider', 'Admin', 'User', 'Trip']
      if (!allowedModule.includes(module)) throw new NotFoundError('NOT_FOUND|MODULE')

      let moduleCode = ''
      if (module == 'User') {
        moduleCode = `USR1000`
        const moduleData = await User.findOne({}, { uniCode: 1 }, { sort: { _id: -1 } }).exec()
        if (moduleData) moduleCode = InvoiceNumber.next(moduleData.uniCode)
      }

      if (module == 'Trip') {
        moduleCode = `TRP1000`
        const moduleData = await Trip.findOne({}, { uniCode: 1 }, { sort: { _id: -1 } }).exec()
        if (moduleData) moduleCode = InvoiceNumber.next(moduleData.uniCode)
      }

      if (moduleCode == '') throw new NotFoundError('NOT_FOUND|MODULE_CODE')
      response = {
        status: true,
        message: 'GENERATED',
        data: {
          code: moduleCode
        }
      }
    } catch (Error) {
      response = {
        status: false,
        data: {},
        message: Error.message || response.message
      }
    }
    return response
  }

  static getUser = async (query) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      const orCond = []
      const findCondition = { deletedAt: null }
      if (query.exceptId) findCondition['_id'] = { $ne: mongoose.Types.ObjectId(query.exceptId) }
      if (query._id) orCond.push({ _id: mongoose.Types.ObjectId(query._id) })
      if (query.phone || query.phoneCode) {
        const phoneValid = []
        if (query.phone) phoneValid.push({ phone: query.phone })
        if (query.phoneCode) phoneValid.push({ phoneCode: query.phoneCode })

        if (phoneValid.length > 0) {
          orCond.push({ $and: phoneValid })
        }
      }

      if (query.email) orCond.push({ email: query.email })

      // Only add `$or` if there are conditions to check
      if (orCond.length > 0) {
        findCondition['$or'] = orCond
      }

      const account = await User.findOne(findCondition).exec()
      console.log('_________', findCondition, query)
      console.log('________account', account)

      if (!account) throw new NotFoundError('NOT_FOUND|USER')

      response.status = true
      response.data = {
        user: account
      }
      response.message = 'FOUND|USER'
    } catch (Error) {
      response = {
        status: false,
        data: {},
        message: Error.message || response.message
      }
    }
    return response
  }

  static getAdmin = async (query) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      const orCond = []
      const findCondition = {}
      if (query.exceptId) findCondition['_id'] = { $ne: mongoose.Types.ObjectId(query.exceptId) }

      if (query.phone || query.phoneCode) {
        const phoneValid = []
        if (query.phone) phoneValid.push({ phone: query.phone })
        if (query.phoneCode) phoneValid.push({ phoneCode: query.phoneCode })

        if (phoneValid.length > 0) {
          orCond.push({ $and: phoneValid })
        }
      }

      if (query.email) orCond.push({ email: query.email })

      findCondition['$or'] = orCond
      const account = await Admin.findOne(findCondition).exec()

      if (!account) throw new NotFoundError('NOT_FOUND|ADMIN')

      response.status = true
      response.data = {
        admin: account
      }
      response.message = 'FOUND|ADMIN'
    } catch (Error) {
      response = {
        status: false,
        data: {},
        message: Error.message || response.message
      }
    }
    return response
  }

  static getAdminGroup = async (query) => {
    console.log('----query-----', query)
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      const orCond = []
      const findCondition = {}
      if (query.exceptId) findCondition['_id'] = { $ne: mongoose.Types.ObjectId(query.exceptId) }
      if (query._id) findCondition['_id'] = query._id
      if (query.group) orCond.push({ group: query.group })
      findCondition['$or'] = orCond
      const adminGroup = await AdminGroup.findOne(findCondition).lean().exec()
      if (!adminGroup) throw new NotFoundError('NOT_FOUND|ADMIN_GROUP')

      response.status = true
      response.data = {
        admin: adminGroup
      }
      response.message = 'FOUND|ADMIN_GROUP'
    } catch (Error) {
      response = {
        status: false,
        data: {},
        message: Error.message || response.message
      }
    }
    return response
  }

  static addFavLocation = async (userId, body) => {
    let response = {
      status: false,
      data: {},
      message: 'UNPROCESSABLE_ENTITY'
    }
    try {
      console.log('Request Data : ', userId, JSON.stringify(body))
      const coordinateArray = [parseFloat(body.location.lat), parseFloat(body.location.lng)]
      console.log('coordinateArray', coordinateArray)
      const updateData = {
        name: body.name,
        address: body.address,
        location: coordinateArray,
        city: body.city,
        state: body.state,
        country: body.country
      }
      console.log('UpdateData', updateData)

      const addFavLocation = await User.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(userId) },
        {
          $push: { favouriteLocation: updateData }
        },
        { new: true }
      )
        .lean()
        .exec()
      if (!addFavLocation) throw new BadRequestError('Failed to add favorite location')
      const newLocation = addFavLocation.favouriteLocation[addFavLocation.favouriteLocation.length - 1]
      response.status = true
      response.data = {
        location: newLocation
      }
      response.message = 'CREATE|FAVOURITE_LOCATION'
    } catch (error) {
      response = {
        status: false,
        data: {},
        message: Error.message || response.message
      }
    }
    return response
  }

  static updateRating = async (ratingData) => {
    try {
      const { userId, rating } = ratingData
      const user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) }).exec()
      if (!user) throw new NotFoundError('NOT_FOUND|USER')

      const newRating = Number(
        (
          ((user.ratings.totalValue || 0) * (user.ratings.totalCount || 0) + (Number(rating) || 0)) /
          ((user.ratings.totalCount || 0) + 1)
        ).toFixed(2)
      )
      if (!newRating) throw new BadRequestError('MIS_CALCULATED_RATING')

      user.ratings.totalValue = newRating
      user.ratings.totalCount = user.ratings.totalCount + 1

      await user.save()
    } catch (error) {
      console.error('UPDATE_RATING_ERROR', error)
    }
  }
}

export { AuthServices }
