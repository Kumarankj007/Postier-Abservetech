/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import Verification from '../../models/Auth/Verification.js'
import { BaseService } from '../BaseService.js'

import Admin from '../../models/Auth/Admin.js'
import { Enum } from '../../utils/Enum.js'
import jwt from 'jsonwebtoken'
import { BadRequestError, NotFoundError, UnprocessableError } from '../../utils/ErrorHandler.js'
import { Config } from '../../config/AppConfig.js'
import User from '../../models/Auth/User.js'

class VerificationService extends BaseService {
  static GenerateRandomNumber = async () => {
    // const Number = Math.floor(1000 + Math.random() * 9000)
    const Number = 1111
    return Number
  }

  static GenerateEmailToken = async (email) => {
    try {
      const token = jwt.sign({ email }, Config.auth.cipherKey, { expiresIn: '1h' })
      return token
    } catch (error) {
      throw new Error('TOKEN_GENERATION_FAILED')
    }
  }

  static validateEmailToken = async (token) => {
    try {
      const decoded = jwt.verify(token, Config.auth.cipherKey)
      return decoded.email
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('TOKEN_EXPIRED')
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('INVALID_TOKEN')
      }
      throw new Error('TOKEN_VERIFICATION_FAILED')
    }
  }

  static GetUsers = async (dataObj, userType) => {
    const response = { success: false, message: 'NOT_FOUND|ADMIN', data: {} }
    try {
      const findQuery = []
      if (dataObj.verifyBy == 'email') {
        findQuery.push({ email: dataObj.email })
      } else {
        findQuery.push({ phoneCode: dataObj.phoneCode })
        findQuery.push({ phoneNumber: dataObj.phoneNumber })
      }
      const user = {
        type: userType
      }
      if (userType == Enum.ROLES.ADMIN) {
        const admin = await Admin.findOne({ $and: findQuery }).lean().exec()
        if (!admin) throw new NotFoundError('NOT_FOUND|ADMIN')
        user['_id'] = admin._id
      }
      response.data.user = user
      response.success = true
    } catch (error) {
      response.message = error.message
    }
    return response
  }

  static create = async (dataObj) => {
    let response = { success: false, message: 'UNPROCESSABLE_ENTITY', data: {} }
    try {
      const {
        email = '',
        phoneNumber = '',
        phoneCode = '',
        userType = Enum.ROLES.ADMIN,

        verifyBy = '',
        verifyFrom = Enum.VERIFICATION.LOGIN,
        randomSMS = await this.GenerateRandomNumber()
      } = dataObj

      if (
        (verifyBy == 'email' && email == '') ||
        (verifyBy != 'email' && (phoneNumber == '' || phoneCode == ''))
      )
        throw new UnprocessableError('UNPROCESSABLE_ENTITY')

      // const userData = {}
      // if (verifyFrom == 'login') {
      //   userData = await this.GetUsers(dataObj, userType)
      //   if (!userData) throw new Error(userData.message)
      // } else {
      //   throw new Error('Unknown Verification Type')
      // }

      const andCondition = [{ userType: userType }, { verified: false }]
      if (verifyBy == 'email') {
        andCondition.push({ email: email })
      } else {
        andCondition.push({ phoneCode: phoneCode })
        andCondition.push({ phoneNumber: phoneNumber })
      }

      const setData = {
        otp: randomSMS,
        verifyBy: verifyBy,
        verifyFrom: verifyFrom,
        userType: userType,
        phoneCode: phoneCode,
        phoneNumber: phoneNumber,
        email: email,
        verified: false,
        createdAt: new Date()
      }

      const addVerify = await Verification.findOneAndUpdate(
        { $and: andCondition },
        { $set: setData },
        { upsert: true, new: true }
      )
        .lean()
        .exec()
      response.data.verification = addVerify
      response.data.randomSMS = randomSMS
      response.success = true
      response.message = 'VERIFICATION_ADDED'
    } catch (Error) {
      response = {
        status: false,
        data: {},
        message: Error.message || response.message
      }
    }

    return response
  }

  static validate = async (dataObj) => {
    let response = { success: false, message: 'UNPROCESSABLE_ENTITY', data: {} }
    try {
      const {
        email = '',
        phoneNumber = '',
        phoneCode = '',
        userType = Enum.ROLES.ADMIN,

        verifyBy = '',
        verifyFrom = Enum.VERIFICATION.LOGIN,
        code = '',
        updateVerify = true
      } = dataObj

      let failureMsg = ''
      const andCondition = [{ userType: userType }, { verified: false }, { verifyFrom: verifyFrom }]
      if (verifyBy == 'email') {
        failureMsg = 'our email could not be verified. Please try again!'
        andCondition.push({ email: email })
      } else {
        failureMsg = 'Your phone number could not be verified. Please try again!'
        andCondition.push({ phoneCode: phoneCode })
        andCondition.push({ phoneNumber: phoneNumber })
      }
      console.log('andCondition', andCondition)

      const getVerify = await Verification.findOne({ $and: andCondition }).exec()
      if (!getVerify) throw new BadRequestError('PLEASE_RESEND')

      const now = new Date()
      const createdAt = new Date(getVerify.updatedAt)
      const elapsedSeconds = (now - createdAt) / 1000

      if (elapsedSeconds > 60) throw new BadRequestError('CODE_EXPIRED')
      else if (getVerify.otp != code) throw new BadRequestError(failureMsg)
      else if (!updateVerify) {
        response.data.verification = getVerify
      } else {
        getVerify.verified = updateVerify
        const updateData = await getVerify.save()
        response.data.verification = updateData
      }
      response.success = true
      response.message = 'VERIFICATION_SUCCESS'
    } catch (error) {
      response = {
        status: false,
        data: {},
        message: error.message || response.message
      }
    }
    return response
  }

  static addVerify = async (req, res) => {
    try {
      const record = await this.create(req.body)
      // let random = await this.GenerateRandomNumber();
      return res.send(record)
    } catch (error) {
      console.log(error)
    }
  }

  static checkVerify = async (req, res) => {
    try {
      const record = await this.validate(req.body)
      // let random = await this.GenerateRandomNumber();
      return res.send(record)
    } catch (error) {
      console.log(error)
    }
  }

  static getVerifiedStatus = async({ email, phone, phoneCode }) => {
    const user = await User.findOne({
      $or:[
        { email },
        { phone, phoneCode }
      ]
    })
    if(!user) return null

    return {
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified
    }
  }
}

export { VerificationService }
