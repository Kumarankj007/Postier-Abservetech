/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import axios from 'axios'
import { Enum } from '../../utils/Enum.js'
import { RequestHandler } from '../../utils/RequestHandler.js'
import { Logger } from '../../utils/Logger.js'

import { BaseController } from '../BaseController.js'
import { AuthValidator } from '../../validators/Common/AuthValidator.js'

import { AuthServices } from '../../services/Common/AuthService.js'

import User from '../../models/Auth/User.js'

import { BadRequestError, UnprocessableError } from '../../utils/ErrorHandler.js'

const logger = new Logger()

const requestHandler = new RequestHandler(logger)
class SocialLoginController extends BaseController {
  constructor() {
    super()
  }

  static async googleAuth(accessToken) {
    const { data } = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return data
  }

  static async facebookAuth(accessToken) {
    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        access_token: accessToken,
        fields: 'id,name,email'
      }
    })
    return data
  }

  static socialLogin = async (req, res) => {
    try {
      const authType = req.params.authType
      const { accessToken } = req.body

      const deviceId = req.headers['x-client-id'] || undefined
      if (!deviceId) throw new BadRequestError('REQUIRED|DEVICEID')

      const validation = await AuthValidator.socialLogin(req.body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      let findUser = {}
      let userInfo = {}
      if (authType == 'google') {
        userInfo = await this.googleAuth(accessToken)
        console.log('userInfo', userInfo)

        // User Search Condition
        findUser = await User.findOne({ loginId: userInfo.id, deletedAt: null })
      } else if (authType == 'facebook') {
        userInfo = await this.facebookAuth(accessToken)
        console.log('userInfo', userInfo)

        // User Search Condition
        findUser = await User.findOne({ loginId: userInfo.id, deletedAt: null })
      } else {
        throw new BadRequestError('INVALID|LOGIN METHOD')
      }
      const module = await AuthServices.uniCodeGenerator('User')
      if (!module.status) throw new BadRequestError('MODULE_CODE_NOT_GENERATED')
      if (!findUser) {
        const newDoc = new User()
        newDoc.uniCode = module.data.code
        newDoc.email = userInfo.email
        newDoc.fname = userInfo.given_name ? userInfo.given_name : userInfo.name
        newDoc.lname = userInfo.family_name
        newDoc.emailVerified = userInfo.verified_email
        newDoc.profile = userInfo.picture
        ;(newDoc.deviceId = deviceId), (findUser = await newDoc.save())
        findUser = await User.findByIdAndUpdate(
          { _id: findUser._id },
          { loginId: userInfo.id, deviceId: deviceId },
          { new: true }
        ).exec()
      }
      const tokenData = {
        userId: findUser._id,
        email: findUser.email,
        name: findUser.fname,
        role: Enum.ROLES.USER,
        deviceId: findUser.deviceId
      }
      const loginToken = await findUser.generateJwt(tokenData)
      return requestHandler.sendSuccess(
        req,
        res,
        'LOGIN_USER'
      )({ message: 'SUCCESS|USER LOGIN', user: findUser, token: loginToken })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }
}
export { SocialLoginController }
