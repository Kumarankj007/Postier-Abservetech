/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'

import { Enum } from '../../utils/Enum.js'
import { RequestHandler } from '../../utils/RequestHandler.js'
import { Logger } from '../../utils/Logger.js'

import { BaseController } from '../BaseController.js'

import { AuthValidator } from '../../validators/Common/AuthValidator.js'

import { AuthServices } from '../../services/Common/AuthService.js'
import { VerificationService } from '../../services/Common/VerificationService.js'
import { Config } from '../../config/AppConfig.js'

import Admin from '../../models/Auth/Admin.js'
import User from '../../models/Auth/User.js'

import { NotifcationController } from '../Notification/Index.js'
import { BadRequestError, NotFoundError, UnprocessableError } from '../../utils/ErrorHandler.js'

import { mailController } from '../Notification/MailGateway.js'
import Posts from '../../models/Service/Post.js'
import Trips from '../../models/Service/Trip.js'
const logger = new Logger()

const requestHandler = new RequestHandler(logger)

class UserController extends BaseController {
  constructor() {
    super()
  }

  // static loginUser = async (req, res) => {
  //   try {
  //     const body = req.body
  //     const query = {}

  //     const deviceId = req.headers['x-client-id'] || undefined
  //     if (!deviceId) throw new BadRequestError('DEVICE_ID_IS_REQUIRED')

  //     const validation = await AuthValidator.loginUser(body)
  //     if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
  //     if (body.loginType == 'facebook' || body.loginType == 'google' || body.loginType == 'apple') {
  //       query['loginType'] = body.loginType
  //       query['loginId'] = body.loginId
  //       const userDatas = await User.findOne(query).exec()
  //       if (!userDatas) throw new NotFoundError('NOT_FOUND|ACCOUNT')
  //     } else {
  //       if (body.email) {
  //         query['email'] = body.email
  //       } else {
  //         query['phone'] = body.phone
  //         query['phoneCode'] = body.phoneCode
  //       }
  //       const userData = await User.findOne(query).exec()
  //       if (!userData) throw new NotFoundError('NOT_FOUND|ACCOUNT')

  //       if (body.code) {
  //         let verifyObj = {
  //           code: body.code,
  //           userType: body.userType
  //         }
  //         if (body.verifyBy == 'email') {
  //           verifyObj = {
  //             ...verifyObj,
  //             email: body.email,
  //             verifyBy: 'email'
  //           }
  //         } else {
  //           verifyObj = {
  //             ...verifyObj,
  //             phoneNumber: body.phone,
  //             phoneCode: body.phoneCode,
  //             verifyBy: 'phone'
  //           }
  //         }
  //         const verifyRes = await VerificationService.validate(verifyObj)
  //         if (verifyRes.status == false) throw new BadRequestError('OTP_DOES_NOT_VERIFIED')
  //       } else {
  //         const passwordIsValid = await userData.validPassword(body.password, userData.salt, userData.hash)
  //         if (!passwordIsValid) throw new BadRequestError('MAKE_SURE_YOUR_PASSWORD')
  //       }
  //     }

  //     const update = {
  //       deviceId: deviceId,
  //       fcmId: body.fcmId || ''
  //     }
  //     const user = await User.findOneAndUpdate(query, update, { new: true }).exec()
  //     const tokenData = {
  //       userId: user._id,
  //       email: user.email,
  //       name: user.fname,
  //       role: Enum.ROLES.USER,
  //       deviceId: user.deviceId
  //     }
  //     const loginToken = await user.generateJwt(tokenData)
  //     return requestHandler.sendSuccess(
  //       req,
  //       res,
  //       'LOGIN_USER'
  //     )({ message: 'SUCCESS', user: user, token: loginToken })
  //   } catch (error) {
  //     return requestHandler.sendError(req, res, error)
  //   }
  // }

  static loginUser = async (req, res) => {
    try {
      const body = req.body
      const query = { deletedAt: null }
      const deviceId = req.headers['x-client-id'] || undefined
      if (!deviceId) throw new BadRequestError('REQUIRED|DEVICEID')

      const validation = await AuthValidator.loginUser(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      if (body.loginType == 'facebook' || body.loginType == 'google' || body.loginType == 'apple') {
        query['loginType'] = body.loginType
        query['loginId'] = body.loginId
      } else {
        if (body.email) {
          query['email'] = body.email
        } else {
          query['phone'] = body.phone
          query['phoneCode'] = body.phoneCode
        }
      }

      const userData = await User.findOne(query)
      if (!userData) throw new Error('NOT_FOUND|USER')

      if (body.code) {
        let verifyObj = {
          code: body.code,
          userType: body.userType
        }
        if (body.verifyBy == 'email') {
          verifyObj = {
            ...verifyObj,
            email: body.email,
            verifyBy: 'email'
          }
        } else {
          verifyObj = {
            ...verifyObj,
            phoneNumber: body.phone,
            phoneCode: body.phoneCode,
            verifyBy: 'phone'
          }
        }

        const verifyRes = await VerificationService.validate(verifyObj)
        if (!verifyRes.success) throw new BadRequestError('OTP_DOES_NOT_VERIFIED')
      } else {
        const passwordIsValid = await userData.validPassword(body.password, userData.salt, userData.hash)
        if (!passwordIsValid) throw new BadRequestError('MAKE_SURE_YOUR_PASSWORD')
      }
      const update = {
        deviceId: deviceId,
        fcmId: body.fcmId || ''
      }
      const user = await User.findOneAndUpdate(query, update, { new: true }).exec()
      const tokenData = {
        userId: user._id,
        email: user.email,
        name: user.fname,
        role: Enum.ROLES.USER,
        deviceId: user.deviceId
      }
      const loginToken = await user.generateJwt(tokenData)
      return requestHandler.sendSuccess(
        req,
        res,
        'LOGIN_USER'
      )({ message: 'SUCCESS|USER LOGIN', user: user, token: loginToken })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getUserExists = async (req, res) => {
    try {
      const query = req.query
      const response = {
        message: 'EXIST|USER',
        account: {
          isExist: false
        }
      }

      const validation = await AuthValidator.getUserExists(query)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      
      // let cond = []  

      // if(req.query.phoneCode || req.query.phone) {
      //   if(req.query.phoneCode) cond.push({ phoneCode: req.query.phoneCode })
      //   if(req.query.phone) cond.push({ phone: req.query.phone })
      // }

      // if(req.query.email) cond.push({ email: req.query.email })

      //   const isExist = await User.findOne({ $and: cond })
      //   if(!isExist) {
      //     response.message = 'NOT_EXIST|USER'
      //     response.account.isExist = false
      //   } else {
      //     response.message = 'EXIST|USER'
      //     response.account.isExist = true
      //   }
      //   console.log("isExist", isExist);
        

      const account = await AuthServices.getUser(req.query)
      
      if (account && account.status) {
        response.account.isExist = true
      } else {
        response.message = 'NOT_EXIST|USER'
        response.account.isExist = false
      }
      // else response.message
      // else throw new NotFoundError('NOT_EXIST|USER')

      return requestHandler.sendSuccess(req, res, 'GET_USER_EXISTS')(response)
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static calculateProfileProgress = async (user) => {
    const fields = [
      user.fname,
      user.lname,
      user.email,
      user.phone,
      user.dob,
      user.emailVerified,
      user.phoneVerified
    ]
    const filled = fields.filter((f) => Boolean(f)).length
    const total = fields.length
    const percent = Math.round((filled / total) * 100)
    return Math.min(100, Math.ceil(percent / 25) * 25)
  }

  static createUser = async (req, res) => {
    try {
      const body = req.body
      const validation = await AuthValidator.createUser(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const account = await AuthServices.getUser(body)
      if (account && account.status) throw new BadRequestError('EXIST|USER ALREADY')
      const module = await AuthServices.uniCodeGenerator('User')
      if (!module.status) throw new BadRequestError('MODULE_CODE_NOT_GENERATED')
      const newUser = new User({
        uniCode: module.data.code,
        type: body.type,
        fname: body.fname,
        lname: body.lname,
        email: body.email,
        phoneCode: body.phoneCode
          ? body.phoneCode.startsWith('+')
            ? body.phoneCode
            : `${body.phoneCode}`
          : undefined,
        phone: body.phone,
        dob: body.dob,

        gender: body.gender,

        city: body.city,
        state: body.state,
        country: body.country,
        address: body.address,

        // emailVerified: body.emailVerified == true,
        // phoneVerified: body.phoneVerified == true,

        vehicleCategory: body.vehicleCategory,
        fcmId: body.fcmId,

        deviceId: req.headers['x-client-id']
      })

      const verifiedRecord = await VerificationService.getVerifiedStatus({
        email: body.email,
        phone: body.phone,
        phoneCode: body.phoneCode
      })

      if (verifiedRecord) {
        newUser.emailVerified = verifiedRecord.emailVerified || false;
        newUser.phoneVerified = verifiedRecord.phoneVerified || false;
      } else {
        newUser.emailVerified = true;
        newUser.phoneVerified = true;
      }

      if (req.file) newUser.profile = req.file.path

      if (
        req.body.loginType == 'facebook' ||
        req.body.loginType == 'google' ||
        req.body.loginType == 'apple'
      ) {
        newUser.loginType = req.body.loginType
        newUser.loginId = req.body.loginId
      } else {
        if (req.body.password != req.body.confirmPassword) {
          throw new BadRequestError('PASSWORD_MISMATCH')
        }
        newUser.setPassword(req.body.password)
      }
      newUser.profilePercentage = await this.calculateProfileProgress(newUser)

      const user = await newUser.save()
      await NotifcationController.createNotification({
        processType: [Enum.NOTIFICATION.TYPE.MAIL],
        data: {
          subject: 'Registration Successfully',
          email: user.email,
          contentdata: { firstname: user?.fname || 'User' },
          description: 'registrationSuccessfully'
        }
      })
      const tokenData = {
        userId: user._id,
        email: user.email,
        name: user.fname,
        role: Enum.ROLES.USER,
        deviceId: user.deviceId
      }

      const loginToken = await user.generateJwt(tokenData)

      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_USER'
      )({ message: 'User created successfully', user: user, token: loginToken })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getUser = async (req, res) => {
    try {
      const queryData = req.query
      const paramData = req.params
      const validation = await AuthValidator.getUser({ _limit: queryData.limit, _page: queryData.page })
      if (!validation.status) {
        throw new UnprocessableError('Validation Failed', validation.data.validate)
      }
      const perPage = queryData.limit
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      const queryObject = { deletedAt: null }

      if (paramData.userId) {
        queryObject._id = mongoose.Types.ObjectId(paramData.userId)
      }
      // if (queryData.search) queryObject.name = { $regex: queryData.search , $options:'i' };
      if (queryData.search) {
        const searchRegex = { $regex: queryData.search, $options: 'i' }
        queryObject.$or = [
          { fname: searchRegex },
          { lname: searchRegex },
          { email: searchRegex },
          { phone: searchRegex }
        ]
      }
      const getDataCount = await User.find(queryObject).count()
      const getData = await User.find(queryObject).sort({ _id: -1 }).skip(skip).limit(perPage)

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_USER'
      )({
        message: 'PROVIDED|USER DATA',
        user: getData,
        total: getDataCount
      })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateUser = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.userId || req.body.userId
      body.exceptId = userId

      const validation = await AuthValidator.updateUser(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      // Only check for duplicates if email or phone is provided
      let account = null
      if (body.email || body.phone) {
        account = await AuthServices.getUser(body)
        if (account && account.status) {
          throw new BadRequestError('EXIST|USER')
        }
      }

      const user = await User.findById(userId).exec()
      if (!user) {
        throw new NotFoundError('NOT_FOUND|USER')
      }
      user.type = body.type || user.type
      user.fname = body.fname || user.fname
      user.lname = body.lname || user.lname

      if (body.email && body.email !== user.email) {
        user.email = body.email
        user.emailVerified = false
      }

      if (body.phone && body.phone !== user.phone) {
        user.phone = body.phone
        user.phoneVerified = false
      }

      user.phoneCode = body.phoneCode
        ? body.phoneCode.startsWith('+')
          ? body.phoneCode
          : `${body.phoneCode}`
        : user.phoneCode

      user.dob = body.dob || user.dob

      user.gender = body.gender || user.gender

      user.city = body.city || user.city
      user.state = body.state || user.state
      user.country = body.country || user.country
      user.address = body.address || user.address

      user.vehicleCategory = body.vehicleCategory || user.vehicleCategory
      user.profilePercentage = await this.calculateProfileProgress(user)

      if (body.password) user.setPassword(body.password)

      if (req.file) user.profile = req.file.path

      const updatedUser = await user.save()
      await NotifcationController.createNotification({
        processType: [Enum.NOTIFICATION.TYPE.MAIL],
        data: {
          subject: 'Profile Updated Successfully',
          email: updatedUser.email,
          contentdata: `Your account information has been updated successfully. If you have any questions or need assistance, feel free to reach out.`,
          description: 'profileUpdate'
        }
      })
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_USER'
      )({ message: 'UPDATED|USER', user: updatedUser })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteUser = async (req, res) => {
    try {
      const body = req.body
      const auth = req.auth

      let userId = null
      if (auth.role == Enum.ROLES.USER) userId = auth.userId
      else userId = req.params.userId || req.body.userId

      if (!userId) throw new BadRequestError('REQUIRED|USERID')
      body.exceptId = userId

      const account = await AuthServices.getUser(body)
      if (!account && !account.status) {
        throw new BadRequestError('NOT_EXIST|USER')
      }
      const user = await User.findOneAndUpdate({ _id: userId }, { deletedAt: new Date() }, { new: true })
      if(!user) throw new BadRequestError('NOT_EXIST|USER')

      await Posts.updateMany({ userId: new mongoose.Types.ObjectId(userId), deletedAt: new Date() })
      await Trips.updateMany({ userId: new mongoose.Types.ObjectId(userId), deletedAt: new Date() })

      await NotifcationController.createNotification({
        processType: [Enum.NOTIFICATION.TYPE.MAIL],
        data: {
          subject: 'Account Deletion Confirmation',
          email: user.email,
          contentdata: { firstname: user?.fname || 'User' },
          description: 'accountDeletion'
        }
      })

      return requestHandler.sendSuccess(req, res, 'DELETE_USER')({ message: 'DELETED|USER', user: user })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateUserStatus = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.userId || req.auth.userId
      body._id = userId

      const validation = await AuthValidator.updateUserStatus(body)

      if (!validation.status) return requestHandler.sendError(req, res, validation.data)

      const account = await AuthServices.getUser(body)
      if (!account || !account.status) {
        throw new NotFoundError('NOT_EXIST|USER')
      }

      const user = await User.findOne({ _id: userId })
      user.status = body.status

      const updatedUser = await user.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'USER_STATUS_UPDATED'
      )({ message: 'UPDATED|USER', data: updatedUser })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static userActive = async (req, res) => {
    try {
      const update = {
        status: 'Active'
      }
      const id = req.query.id || req.auth.userId

      const activedata = await User.findOneAndUpdate({ _id: id }, update, { new: true }).exec()
      return requestHandler.sendSuccess(
        req,
        res,
        'USER_ACTIVE'
      )({ message: 'SUCCESS|USER ACTIVATION', Data: activedata })
    } catch (error) {
      return requestHandler.sendSuccess(req, res, error)
    }
  }

  static userInactive = async (req, res) => {
    try {
      const update = {
        status: 'Inactive'
      }
      const id = req.query.id || req.auth.userId
      const inactivedata = await User.findOneAndUpdate({ _id: id }, update, { new: true }).exec()
      // updatePartnerProofStatusInFB(req.params.id, 'Accepted');
      return requestHandler.sendSuccess(
        req,
        res,
        'USER_INACTIVE'
      )({ message: 'SUCCESS|USER INACTIVATION', Data: inactivedata })
    } catch (error) {
      return requestHandler.sendSuccess(req, res, error)
    }
  }

  static setPassword = async (req, res) => {
    try {
      const userId = req.auth.userId || req.params.userId
      const { newPassword, confirmPassword } = req.body
      if (!newPassword || !confirmPassword) throw new BadRequestError('Both password fields are required.')

      if (newPassword !== confirmPassword) throw new BadRequestError('Passwords do not match.')

      const validation = await AuthValidator.setPassword(req.body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await AuthServices.getUser(userId)
      if (!account && !account.status) {
        throw new BadRequestError('NOT_EXIST|USER')
      }
      const user = await User.findOne({ _id: userId })
      user.setPassword(newPassword)

      const updatedUser = await user.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'SET_PASSWORD'
      )({ message: 'SET|PASSWORD', user: updatedUser })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static resetPassword = async (req, res) => {
    try {
      const auth = req.auth ? req.auth : null
      const body = req.body
      console.log('body', body)

      let userId = null
      if (auth) {
        if (auth.role == Enum.ROLES.ADMIN) userId = body._id
        else userId = body._id
      }
      if (userId) body._id = userId.toString()
      // else userId = body._id.toString()

      const validation = await AuthValidator.changepassword(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      if (body.verificationToken) {
        const isTokenValid = await VerificationService.validateEmailToken(body.verificationToken)
        if (!isTokenValid) throw new Error(isTokenValid.message)
        body.email = isTokenValid
      }

      let account
      const skipArray = [
        Enum.VERIFICATION.LOGIN,
        Enum.VERIFICATION.FORGETPASSWORD,
        Enum.VERIFICATION.CHANGEPASSWORD
      ]
      if (skipArray.includes(body.verifyFrom)) {
        const userWhere = {}
        if (req.auth == null) {
          if (body.email) {
            userWhere['email'] = body.email
          } else if (body._id) {
            // userWhere['_id'] = mongoose.Types.ObjectId(userId)
            userWhere['_id'] = mongoose.Types.ObjectId(body._id)
          } else {
            userWhere['phone'] = body.phone
            userWhere['phoneCode'] = body.phoneCode
          }
        } else {
          userWhere['_id'] = mongoose.Types.ObjectId(body._id)
        }
        console.log('--------userWhere', userWhere)
        account = await User.findOne(userWhere).exec()
        if (!account) throw new NotFoundError('NOT_FOUND|USER')
      }
      let user = null

      if (
        /* !auth || !auth.role || auth.role == Enum.ROLES.PARTNER && */ body.verifyFrom ==
        Enum.VERIFICATION.FORGETPASSWORD
      ) {
        let verifyObj = {
          code: body.code,
          userType: body.userType,
          verifyFrom: body.verifyFrom
        }
        if (body.verifyBy == 'email' && !body.verificationToken) {
          verifyObj = {
            ...verifyObj,
            email: body.email,
            verifyBy: 'email'
          }
        }
        if (body.verifyBy == 'phone') {
          verifyObj = {
            ...verifyObj,
            phoneNumber: body.phone,
            phoneCode: body.phoneCode,
            verifyBy: 'phone'
          }
        }
        

        if (!body.verificationToken) {
          const verifyRes = await VerificationService.validate(verifyObj)
          if (verifyRes.status == false) throw new BadRequestError('OTP_DOES_NOT_VERIFIED')
        }
        account.setPassword(body.password)
        user = await account.save()
      } else if (/* auth && */ body.verifyFrom == Enum.VERIFICATION.CHANGEPASSWORD) {
        // if (auth.role == Enum.ROLES.USER) {
        const passwordIsValid = account.validPassword(body.oldpassword, account.salt, account.hash)
        if (!passwordIsValid) throw new BadRequestError('INVALID|PASSWORD')
        if (body.password != body.newpassword) throw new BadRequestError('PASSWORD_MISMATCH')
        if (body.oldpassword == body.newpassword)
          throw new BadRequestError('OLD_PASSWORD_AND_NEW_PASSWORD_CANT_BE_SAME')
        // }
        account.setPassword(body.newpassword)
        user = await account.save()
      } else {
        throw new BadRequestError('UNKNOWN_VERIFY_FROM')
      }

      let successMessage = 'PASSWORD_CHANGED|USER'
      if(body.verifyFrom == Enum.VERIFICATION.FORGETPASSWORD) {
        successMessage = 'Your password has been successfully updated. Please log in with your new password.'
      }

      return requestHandler.sendSuccess(
        req,
        res,
        'CHANGE_PASSWORD'
      )({ message: successMessage, user: user })
    } catch (error) {
      console.log(error, 'error')
      return requestHandler.sendError(req, res, error)
    }
  }

  static changePassword = async (req, res) => {
    try {
      const auth = req.auth
      const { currentPassword, newPassword, confirmPassword, userId } = req.body

      if(!newPassword || !confirmPassword) throw new BadRequestError('Both password fields are required')

      if(newPassword != confirmPassword) throw new BadRequestError('Passwords do not match')

      let targetUserId
      if(auth.role == Enum.ROLES.ADMIN) {
        if(!userId) throw new BadRequestError('Admin must provide userId')
          targetUserId = userId
      } else {
        targetUserId = auth.userId
      }

      const account = await User.findById(targetUserId)
      if(!account) throw new BadRequestError('User not found')

      if(auth.role != Enum.ROLES.ADMIN) {
        if(!currentPassword) throw new BadRequestError('Current password is required')
        const isValid = account.validPassword(currentPassword, account.salt, account.hash)  
        if(!isValid) throw new BadRequestError('Current password is incorrect');
        if (currentPassword == newPassword) throw new BadRequestError('Old and new password cannot be the same');
      }

      account.setPassword(newPassword)
      const user = await account.save()

      return requestHandler.sendSuccess(req, res, 'CHANGE_PASSWORD')({
        message: 'Password changed successfully',
        user
      });      
    } catch (error) {
      console.log(error, 'error')
      return requestHandler.sendError(req, res, error)      
    }
  }

  static verification = async (req, res) => {
    try {
      const body = req.body
      let successMsg = ''

      const validation = await AuthValidator.verification(body)
      let account
      let updateVerify = true
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const skipArray = [
        Enum.VERIFICATION.LOGIN,
        Enum.VERIFICATION.FORGETPASSWORD,
        Enum.VERIFICATION.CHANGEPASSWORD,
        Enum.VERIFICATION.VERIFICATION
      ]
      if (skipArray.includes(body.verifyFrom)) {
        const userWhere = {}
        if (req.auth == null) {
          if (body.email) {
            userWhere['email'] = body.email
          } else {
            userWhere['phone'] = body.phone
            userWhere['phoneCode'] = body.phoneCode
          }
        } else {
          userWhere['_id'] = req.auth.userId
        }

        account = await User.findOne(userWhere).select('-hash -salt').exec()
        if (!account) throw new NotFoundError('NOT_FOUND|USER')

        if ([Enum.VERIFICATION.FORGETPASSWORD, Enum.VERIFICATION.CHANGEPASSWORD].includes(body.verifyFrom))
          updateVerify = false
      }

      let verifyObj = {
        code: body.code,
        userType: body.userType,
        verifyFrom: body.verifyFrom,
        updateVerify: updateVerify
      }

      if (body.verifyBy == 'email') {
        verifyObj = {
          ...verifyObj,
          email: body.email,
          verifyBy: 'email'
        }
        successMsg = 'Your email address is now verified!'
      } else {
        verifyObj = {
          ...verifyObj,
          phoneNumber: body.phone,
          phoneCode: body.phoneCode,
          verifyBy: 'phone'
        }
        successMsg = 'Your phone number is now verified!'
      }
      const verifyRes = await VerificationService.validate(verifyObj)
      if (verifyRes.status == false) throw new BadRequestError(verifyRes?.message || 'OTP_DOES_NOT_VERIFIED')
      let user
      if (account) {
        if (body.verifyBy == 'email') {
          account.emailVerified = true
        } else {
          account.phoneVerified = true
        }

        account.profilePercentage = await this.calculateProfileProgress(account)
        user = await account.save()
      }

      return requestHandler.sendSuccess(req, res, 'VERIFICATION')({ message: successMsg, user: user })
    } catch (error) {
      console.log(error)

      return requestHandler.sendError(req, res, error)
    }
  }

  static sendOtp = async (req, res) => {
    try {
      const body = req.body

      let emailToken = ''
      let verifyRes = {}
      const validation = await AuthValidator.sendOtpverify(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      if (body.email && body.verifyFrom === Enum.VERIFICATION.FORGETPASSWORD) {
        emailToken = await VerificationService.GenerateEmailToken(body.email)
      }
      let verifyObj = {
        verifyFrom: body.verifyFrom || Enum.VERIFICATION.LOGIN,
        userType: body.userType
      }
      if (body.verifyBy == 'email') {
        if (emailToken && body.email && body.verifyFrom === Enum.VERIFICATION.FORGETPASSWORD) {
          // Send Email
          const verificationLink = `${Config.app.baseurl}account/resetpassword/?token=${emailToken}`
          await mailController.sendMail({
            data: {
              description: 'resetpassword',
              subject: 'Reset Password',
              content: { name: body.name || 'User', url: verificationLink },
              email: body.email || ''
            }
          })
        } else {
          verifyObj = {
            ...verifyObj,
            email: body.email,
            verifyBy: 'email',
            randomSMS: await VerificationService.GenerateRandomNumber()
          }
          console.log('verifyObj', verifyObj)

          // Send Email
          await mailController.sendMail({
            data: {
              description: 'verifyemail',
              subject: 'Your Postier Email Verification Code',
              content: { otp: verifyObj.randomSMS },
              email: body.email || ''
            }
          })
        }
      } else {
        verifyObj = {
          ...verifyObj,
          phoneNumber: body.phone,
          phoneCode: body.phoneCode,
          verifyBy: 'phone',
          randomSMS: await VerificationService.GenerateRandomNumber()
        }
        console.log('verifyobj', verifyObj);

        const user = await User.findOne({ phoneCode: body.phoneCode, phone: body.phone })

        // Send Email
        await mailController.sendMail({
          data: {
            description: 'verifyphone',
            subject: 'Your Postier phone verification code',
            content: { otp: verifyObj.randomSMS },
            email: body?.email || user?.email || ''
          }
        })
      }
      if (!emailToken) {
        verifyRes = await VerificationService.create(verifyObj)
        if (verifyRes.status == false) throw new BadRequestError('CONTACT_SUPPORT')
      } else {
        verifyRes = {
          status: true,
          message: 'VERIFICATION_EMAIL_SENT',
          data: {}
        }
      }

      let successMessage = '';

      if (body.verifyFrom == Enum.VERIFICATION.FORGETPASSWORD && body.verifyBy === 'email') {
        successMessage = 'We’ve sent a password reset link to your email. Please check your inbox (and spam folder just in case).'
      } else if (body.verifyBy === 'email') {
        successMessage = 'Check your email address and enter the OTP code we just sent to your email to complete the verification.';
      } else if (body.verifyBy === 'phone') {
        successMessage = 'Check your phone and enter the OTP code we just sent via SMS to complete the verification.';
      } else {
        successMessage = 'OTP sent successfully.';
      }

      return requestHandler.sendSuccess(
        req,
        res,
        'SEND_OTP'
      )({ message: successMessage, verifyRes: verifyRes.data })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getProfile = async (req, res) => {
    try {
      const authData = req.auth
      const paramData = req.params

      const userId =
        authData.role == Enum.ROLES.USER
          ? mongoose.Types.ObjectId(authData.userId)
          : mongoose.Types.ObjectId(paramData.userId)

      const userData = await User.findOne({ _id: userId }).lean().exec()
      if (!userData) throw new NotFoundError('NOT_FOUND|USER')

      if(userData.hash == '' && userData.salt == '') userData.noPassword = true
      else userData.noPassword = false

      delete userData.hash
      delete userData.salt


      return requestHandler.sendSuccess(
        req,
        res,
        'GET_USER'
      )({
        message: 'PROVIDED|USER DATA',
        profile: userData
      })
    } catch (error) {
      console.log('error', error)

      return requestHandler.sendError(req, res, error)
    }
  }

  static logout = async (req, res) => {
    try {
      const userRole = req.auth.role
      if (userRole == 'ADMIN') {
        const update = {
          deviceId: ''
        }
        Admin.findOneAndUpdate({ _id: req.auth.userId }, update, { new: true }).exec()

        return requestHandler.sendSuccess(
          req,
          res,
          'LOGOUT'
        )({
          message: 'SUCCESS|USER LOGGED OUT'
        })
      } else {
        const update = {
          deviceId: ''
        }
        User.findOneAndUpdate({ _id: req.auth.userId }, update, { new: true }).exec()

        return requestHandler.sendSuccess(
          req,
          res,
          'LOGOUT'
        )({
          message: 'LOGOUT_SUCCESS'
        })
      }
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static addFavLocation = async (req, res) => {
    try {
      const body = req.body
      const userId = req.auth.userId

      const validation = await AuthValidator.addFavLocation(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const addlocation = await AuthServices.addFavLocation(userId, body)
      if (addlocation.status == false) throw new BadRequestError('CONTACT_SUPPORT')

      return requestHandler.sendSuccess(
        req,
        res,
        'ADD_FAV_LOCATION'
      )({ message: 'CREATED|FAV LOCATION', locations: addlocation })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateFavLocation = async (req, res) => {
    try {
      const body = req.body
      const validation = await AuthValidator.updateFavLocation(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const updateFavLocation = await User.findById({ _id: req.auth.userId }).lean().exec()
      if (!updateFavLocation) throw new NotFoundError('NOT_FOUND|USER')
      const id = mongoose.Types.ObjectId(req.auth.userId)
      const query = {
        _id: id,
        favouriteLocation: { $elemMatch: { _id: req.query.favLocationId } }
      }

      const update = {
        $set: {
          'favouriteLocation.$.name': body.name,
          'favouriteLocation.$.address': body.address,
          'favouriteLocation.$.location': body.location,
          'favouriteLocation.$.state': body.state,
          'favouriteLocation.$.country': body.country,
          'favouriteLocation.$.city': body.city
          // 'favouriteLocation.$.pinCode': body.pinCode
        }
      }

      const FavLocation = await User.findOneAndUpdate(query, update, { new: true }).exec()

      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_FAV_LOCATION'
      )({ message: 'UPDATED|FAV LOCATION', locations: FavLocation })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getFavLocation = async (req, res) => {
    try {
      const getFavLocation = await User.findOne({ _id: req.auth.userId }).lean().exec()
      if (!getFavLocation) {
        throw new NotFoundError('NOT_FOUND|USER')
      }
      // if (getFavLocation.FavouriteLocation.length == 0) {
      //   throw new Error('NO_DATA_FOUND')
      // }
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_FAV_LOCATION'
      )({ message: 'PROVIDED|FAV LOCATION', locations: getFavLocation.favouriteLocation })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static delFavLocation = async (req, res) => {
    try {
      const query = req.query
      const validation = await AuthValidator.deleteFavLocation(query)
      if (!validation.status) {
        throw new UnprocessableError('Validation Failed', validation.data.validate)
      }
      const delFavLocation = await User.findById(req.auth.userId).exec()
      if (!delFavLocation) {
        throw new NotFoundError('NOT_FOUND|USER')
      }

      const updateResult = await User.updateOne(
        { _id: mongoose.Types.ObjectId(req.auth.userId) },
        { $pull: { favouriteLocation: { _id: mongoose.Types.ObjectId(body.favLocationId) } } }
      )
      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_FAV_LOCATION'
      )({ message: 'DELETED|FAV LOCATION', location: updateResult })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static switchRoles = async (req, res) => {
    try {
      const auth = req.auth

      const findUser = await User.findOne({ _id: auth.userId })
      if (!findUser) throw new BadRequestError('NOT_FOUND|USER')

      const type = findUser.type === 'user' ? 'postier' : 'user'

      findUser.type = type

      const switchedUser = await findUser.save()

      return requestHandler.sendSuccess(
        req,
        res,
        `SWITCHED_TO_${type.toUpperCase()}`
      )({ message: `SWITCHED|${type.toUpperCase()}`, data: switchedUser })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }
}

export { UserController }
