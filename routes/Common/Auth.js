/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import * as express from 'express'
import { Enum } from '../../utils/Enum.js'

import { UserController as User } from './../../controllers/Auth/UserController.js'
import { AdminController as Admin } from './../../controllers/Auth/AdminController.js'
import { SocialLoginController as SocialLogin } from '../../controllers/Auth/SocialLoginController.js'

import { AuthMiddleware } from '../../middlewares/AuthMiddleware.js'
const { authorize } = AuthMiddleware

import { UploadMiddlewware } from './../../middlewares/UploadMiddleware.js'
// import { auth } from 'google-auth-library'
const AuthFile = new UploadMiddlewware({ path: './public/temp/auth' }).singleFileUpload

const Router = express.Router()

// User API
Router.route('/common/user/exists').get(User.getUserExists)
Router.route('/common/user/verification').post(
  // addAuth([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  User.verification
)
Router.route('/common/user/setPassword').post(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  User.setPassword
)
Router.route('/common/user/switch').get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), User.switchRoles)
Router.route('/common/user/changePassword').post(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  User.changePassword
)
Router.route('/common/user/resetPassword').post(User.resetPassword)
Router.route('/common/user/userActive').post(authorize([Enum.ROLES.ADMIN]), User.userActive)
Router.route('/common/user/userInactive').post(authorize([Enum.ROLES.ADMIN]), User.userInactive)
Router.route('/common/user/:userId?')
  .post(AuthFile, User.createUser)
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), User.getUser)
  .put(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), AuthFile, User.updateUser)
  .patch(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), User.updateUserStatus)
  .delete(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), User.deleteUser)
Router.route('/common/user/profile/:userId?').get(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  User.getProfile
)
Router.route('/common/admin/menusList').get(Admin.getMenuList)
// Admin API
Router.route('/common/admin/changePassword').post(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  Admin.changePassword
)

Router.route('/common/admin/exists').get(Admin.getAdminExists)
Router.route('/common/admin/profile').get(authorize([Enum.ROLES.ADMIN]), Admin.viewAdminProfile)
Router.route('/common/admin/:adminId?')
  .post(AuthFile, Admin.createAdmin)
  .get(authorize([Enum.ROLES.ADMIN]), AuthFile, Admin.getAdmin)
  .put(authorize([Enum.ROLES.ADMIN]), AuthFile, Admin.updateAdmin)
  .delete(authorize([Enum.ROLES.ADMIN]), AuthFile, Admin.deleteAdmin)

// Admin Group API

Router.route('/common/adminGroup/list').get(authorize([Enum.ROLES.ADMIN]), Admin.listAdminGroup)
Router.route('/common/adminGroup/:adminGroupId?')
  .get(authorize([Enum.ROLES.ADMIN]), Admin.getAdminGroup)
  .post(authorize([Enum.ROLES.ADMIN]), Admin.createAdminGroup)
  .put(authorize([Enum.ROLES.ADMIN]), Admin.updateAdminGroup)
  .delete(authorize([Enum.ROLES.ADMIN]), Admin.deleteAdminGroup)

// Common API
Router.route('/common/login/admin').post(Admin.loginAdmin)
Router.route('/common/login/user').post(User.loginUser)
Router.route('/common/forgotPassword').post(Admin.sendOtp)
Router.route('/common/changepassword').post(Admin.changePasswordForForgotPassword)
Router.route('/common/sendOtp').post(User.sendOtp)
Router.route('/common/logout').patch(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), User.logout)

Router.route('/common/favouriteLocation')
  .post(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), User.addFavLocation)
  .get(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), User.getFavLocation)
  .put(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), User.updateFavLocation)
  .delete(authorize([Enum.ROLES.USER, Enum.ROLES.ADMIN]), User.delFavLocation)

// Social Login
Router.route('/common/login/:authType').put(SocialLogin.socialLogin)

export { Router as Auth }
