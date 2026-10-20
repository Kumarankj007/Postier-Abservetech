/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'

import { BaseController } from '../BaseController.js'
import Admin from '../../models/Auth/Admin.js'
import AdminGroup from '../../models/Auth/AdminGroup.js'
import User from '../../models/Auth/User.js'

import { AuthValidator } from '../../validators/Common/AuthValidator.js'
import { AuthServices } from '../../services/Common/AuthService.js'
import { VerificationService } from '../../services/Common/VerificationService.js'

import { RequestHandler } from '../../utils/RequestHandler.js'
import { Logger } from '../../utils/Logger.js'
import { Enum } from '../../utils/Enum.js'

import { BadRequestError, NotFoundError, UnprocessableError } from '../../utils/ErrorHandler.js'
import { permissions } from '../../config/Permissions.js'
import { QueryBuilder } from '../../helpers/QueryBuilder.js'
import { mailController } from '../Notification/MailGateway.js'
// import { has } from 'lodash'
const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class AdminController extends BaseController {
  constructor() {
    super()
  }

  static loginAdmin = async (req, res) => {
    try {
      const body = req.body
      const validation = await AuthValidator.loginAdmin(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const DeviceId = req.headers['x-client-id'] || undefined
      if (!DeviceId) throw new BadRequestError('REQUIRED|DEVICEID')

      const query = {}

      if (body.email) {
        query['email'] = body.email
      } else {
        query['phone'] = body.phone
        query['phoneCode'] = body.phoneCode
      }

      const update = {
        deviceId: DeviceId
      }

      // const admin = await Admin.findOne(query).populate('group').exec()
      // if (!admin) throw new AuthendicationError('NOT_FOUND|ADMIN')

      const admin = await Admin.findOneAndUpdate(query, update, { new: true }).exec()
      if (!admin) throw new NotFoundError('NOT_FOUND|ADMIN')

      const passwordIsValid = await admin.validPassword(body.password, admin.salt, admin.hash)
      if (!passwordIsValid) throw new BadRequestError('MAKE_SURE_YOUR_PASSWORD!')

      const tokenData = {
        userId: admin._id,
        email: admin.email,
        name: admin.fname,
        group: admin.group,
        role: Enum.ROLES.ADMIN
      }
      const loginToken = await admin.generateJwt(tokenData)
      return requestHandler.sendSuccess(
        req,
        res,
        'LOGIN_ADMIN'
      )({ message: 'SUCCESS|ADMIN LOGIN', admin: admin, token: loginToken })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getAdmin = async (req, res) => {
    try {
      const validation = await AuthValidator.getAdmin(req.query)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const queryData = req.query
      const paramData = req.params
      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      const queryBuilder = await QueryBuilder.getSearchable(Admin, queryData)
      const queryObject = queryBuilder.queryObject

      if (paramData.adminId) {
        queryObject['_id'] = mongoose.Types.ObjectId(paramData.adminId)
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
      console.log(queryObject)
      const getDataCount = await Admin.find(queryObject).count()

      const getData = await Admin.find(queryObject).skip(skip).limit(perPage)

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_ADMIN'
      )({ message: 'PROVIDED|ADMIN DATA', admin: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static createAdmin = async (req, res) => {
    try {
      const body = req.body
      const validation = await AuthValidator.createAdmin(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await AuthServices.getAdmin(body)
      if (account && account.status) throw new BadRequestError('EXIST|ADMIN')

      const newDoc = new Admin({
        fname: body.fname,
        lname: body.lname,
        email: body.email,
        phone: body.phone,
        phoneCode: body.phoneCode,
        group: body.group,
        scIds: body.scIds && body.scIds != '' ? body.scIds.split(',') : [],
        fcmId: body.fcmId
      })

      if (req.file) newDoc.profile = req.file.path

      newDoc.setPassword(body.password)

      const admin = await newDoc.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_ADMIN'
      )({ message: 'CREATED|ADMIN', admin, admin: admin })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateAdmin = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.adminId || req.body.userId
      body.exceptId = userId

      const validation = await AuthValidator.updateAdmin(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await AuthServices.getAdmin(body)
      if (account && account.status) {
        // if (account.data.admin._id != mongoose.Types.ObjectId(userId))
        throw new BadRequestError('EXIST|ADMIN')
      }

      const admin = await Admin.findById(userId).exec()
      if (!admin) {
        throw new NotFoundError('NOT_FOUND|ADMIN')
      }
      admin.fname = body.fname || admin.fname
      admin.lname = body.lname || admin.lname
      admin.email = body.email || admin.email
      admin.phone = body.phone || admin.phone
      admin.phoneCode = body.phoneCode || admin.phoneCode
      admin.group = body.group || admin.group
      admin.scIds = body.scIds && body.scIds != '' ? body.scIds.split(',') : admin.scIds
      admin.fcmId = body.fcmId || admin.fcmId
      if (req.file) admin.profile = req.file.path

      if (body.password) admin.setPassword(body.password)

      const updatedAdmin = await admin.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_ADMIN'
      )({ message: 'UPDATED|ADMIN', admin: updatedAdmin })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteAdmin = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.adminId || req.body.userId
      body._id = userId
      const validation = await AuthValidator.deleteAdmin(body)
      if (!validation.status) {
        throw new UnprocessableError('Validation Failed', validation.data.validate)
      }
      const account = await AuthServices.getAdmin(body)
      if (!account && !account.status) throw new BadRequestError('NOT_EXIST|ADMIN')
      const customer = await Admin.findById(userId).remove().exec()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_ADMIN'
      )({ message: 'DELETED|ADMIN', customer: customer })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static viewAdminProfile = async (req, res) => {
    try {
      const adminId = mongoose.Types.ObjectId(req.auth.userId)
      const docs = await Admin.findById(adminId, { salt: 0, hash: 0 })
        .populate('group', 'group description permission')
        .exec()

      if (!docs) throw new NotFoundError('NOT_EXIST|ADMIN')
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_ADMIN'
      )({ message: 'PROVIDED|ADMIN DATA', admin: docs })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static changePassword = async (req, res) => {
    try {
      const body = req.body
      const id = body._id

      const validation = await AuthValidator.changepassword(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await User.findOne({ _id: id }).exec()
      if (!account) throw new NotFoundError('NOT_FOUND|USER')
      account.setPassword(body.password)
      const user = await account.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'CHANGE_PASSWORD'
      )({ message: 'PASSWORD_CHANGED|USER', user: user })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static changePasswordForForgotPassword = async (req, res) => {
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
        account = await Admin.findOne(userWhere).exec()
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
        if (!passwordIsValid) throw new BadRequestError('MAKE_SURE_YOUR_PASSWORD!')
        if (body.password != body.newpassword) throw new BadRequestError('PASSWORD_MISMATCH')
        if (body.oldpassword == body.newpassword)
          throw new BadRequestError('OLD_PASSWORD_AND_NEW_PASSWORD_CANT_BE_SAME')
        // }
        account.setPassword(body.newpassword)
        user = await account.save()
      } else {
        throw new BadRequestError('UNKNOWN_VERIFY_FROM')
      }

      return requestHandler.sendSuccess(
        req,
        res,
        'CHANGE_PASSWORD'
      )({ message: 'PASSWORD_CHANGED|USER', user: user })
    } catch (error) {
      console.log(error, 'error')
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
        verifyFrom: body.verifyFrom || Enum.VERIFICATION.FORGETPASSWORD,
        userType: body.userType || 'ADMIN'
      }
      if (body.verifyBy == 'email') {
        if (emailToken && body.email && body.verifyFrom === Enum.VERIFICATION.FORGETPASSWORD) {
          // Send Email
          const verificationLink = `https://postier.org/account/resetpassword/?token=${emailToken}`
          await mailController.sendMail({
            description: 'resetpassword',
            subject: 'Reset Password',
            content: { name: body.name || 'Admin', url: verificationLink },
            email: body.email || ''
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
            description: 'verifyemail',
            subject: 'Verify Email',
            content: { otp: verifyObj.randomSMS },
            email: body.email || ''
          })
        }
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

      return requestHandler.sendSuccess(
        req,
        res,
        'SEND_OTP'
      )({ message: 'OTP_SENT_SUCCESS', verifyRes: verifyRes.data })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getAdminExists = async (req, res) => {
    try {
      const query = req.query

      const validation = await AuthValidator.getAdminExists(query)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await AuthServices.getAdmin(req.query)
      if (account && account.status) throw new BadRequestError('EXIST|ADMIN')

      return requestHandler.sendSuccess(req, res, 'GET_ADMIN_EXISTS')({ message: 'NOT_EXIST|ADMIN' })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  /* static getMenuList = async (req, res) => {
    try {
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_MENU_LIST'
      )({ message: 'LISTED|MENU', menuList: JSON.parse(JSON.stringify(permissions.menusList)) })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  } */

  static getMenuList = async (req, res) => {
    try {
      const menuList = permissions.menusList
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_MENU_LIST'
      )({
        message: 'LISTED|MENU',
        menuList
      })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static listAdminGroup = async (req, res) => {
    try {
      const validation = await AuthValidator.getAdmin(req.query)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const queryData = req.query
      const queryBuilder = await QueryBuilder.getSearchable(Admin, queryData)
      const queryObject = queryBuilder.queryObject
      const listData = await AdminGroup.find(queryObject, { _id: 1, group: 1 }).lean().exec()

      return requestHandler.sendSuccess(
        req,
        res,
        'LIST_ADMIN_GROUP'
      )({ message: 'LISTED|ADMIN GROUP', adminGroup: listData })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }
  static getAdminGroup = async (req, res) => {
    try {
      const validation = await AuthValidator.getAdmin(req.query)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const queryData = req.query
      const paramData = req.params
      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      const queryBuilder = await QueryBuilder.getSearchable(Admin, queryData)
      const queryObject = queryBuilder.queryObject

      if (paramData.adminGroupId || queryData.adminGroupId) {
        const adminGroupId = paramData.adminGroupId || queryData.adminGroupId
        queryObject['_id'] = mongoose.Types.ObjectId(adminGroupId)
      }

      const getDataCount = await AdminGroup.find(queryObject).count()
      const getData = await AdminGroup.find(queryObject).skip(skip).limit(perPage)

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_ADMIN_GROUP'
      )({ message: 'PROVIDED|ADMIN GROUP', adminGroup: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static createAdminGroup = async (req, res) => {
    try {
      const body = req.body

      const validation = await AuthValidator.createAdminGroup(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await AuthServices.getAdminGroup(body)
      if (account && account.status) throw new BadRequestError('EXIST|ADMIN_GROUP')

      const newDoc = new AdminGroup({
        group: body.group,
        description: body.description,
        permission: body.permission
      })

      const adminGroup = await newDoc.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_ADMIN_GROUP'
      )({ message: 'CREATED|ADMIN_GROUP', adminGroup })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateAdminGroup = async (req, res) => {
    try {
      const body = req.body

      const validation = await AuthValidator.createAdminGroup(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      // if (body.group == 'SUPERADMIN') throw new ValidationError('NO_ACCESS_TO_EDIT')

      const adminGroupId = req.params.adminGroupId
      body.exceptId = adminGroupId
      const account = await AuthServices.getAdminGroup(body)
      if (account && account.status) throw new BadRequestError('EXIST|ADMIN_GROUP')

      const adminGroup = await AdminGroup.findById(adminGroupId).exec()
      adminGroup.group = body.group || adminGroup.group
      adminGroup.description = body.description || adminGroup.description
      adminGroup.permission = body.permission || adminGroup.permission

      const updatedAdminGroup = await adminGroup.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_ADMIN_GROUP'
      )({ message: 'UPDATED|ADMIN_GROUP', adminGroup: updatedAdminGroup })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteAdminGroup = async (req, res) => {
    try {
      const body = req.body
      const adminGroupId = req.params.adminGroupId
      body._id = adminGroupId

      const account = await AuthServices.getAdminGroup(body)
      if (!account || !account.status) throw new NotFoundError('NOT_EXIST|ADMIN')
      const adminGroupData = await AdminGroup.findById(adminGroupId).lean().exec()
      if (adminGroupData.group == 'SUPERADMIN') throw new BadRequestError('NO_ACCESS_TO_EDIT')

      const adminGroup = await AdminGroup.findById(adminGroupId).remove().exec()
      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_ADMIN_GROUP'
      )({ message: 'DELETED|ADMIN_GROUP', adminGroup: adminGroup })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }
}

export { AdminController }
