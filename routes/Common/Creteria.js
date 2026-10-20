/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import * as express from 'express'
import { Enum } from '../../utils/Enum.js'

import { CouponController as CouponModule } from '../../controllers/Creteria/CouponController.js'
import { OfferController as OfferModule } from '../../controllers/Creteria/OfferController.js'
import { ServiceTypeController as ServiceType } from '../../controllers/Creteria/ServiceTypeController.js'
import { VehicleController as vehicle } from '../../controllers/Creteria/VehicleController.js'
import { PricingController as Price } from '../../controllers/Creteria/PricingController.js'

import { AuthMiddleware } from '../../middlewares/AuthMiddleware.js'
const { authorize, addAuth } = AuthMiddleware

import { UploadMiddlewware } from './../../middlewares/UploadMiddleware.js'
const ServiceTypeFile = new UploadMiddlewware({
  path: './public/temp/auth',
  fileFields: [
    { name: 'file1', maxCount: 1 },
    { name: 'file2', maxCount: 1 }
  ]
}).multipleKnownFields
const OfferFile = new UploadMiddlewware({ path: './public/Offer' }).singleFileUpload

const Router = express.Router()

Router.route('/serviceType/list').get(ServiceType.listAllServiceType)
Router.route('/serviceType/:serviceTypeId?')
  .get(authorize([Enum.ROLES.ADMIN]), ServiceType.getServicesType)
  .post(authorize([Enum.ROLES.ADMIN]), ServiceTypeFile, ServiceType.createServicesType)
  .put(authorize([Enum.ROLES.ADMIN]), ServiceTypeFile, ServiceType.updateServicesType)
  .delete(authorize([Enum.ROLES.ADMIN]), ServiceType.deleteServicesType)

Router.route('/pricing/:pricingId?')
  .get(authorize([Enum.ROLES.ADMIN]), Price.getPricing)
  .post(authorize([Enum.ROLES.ADMIN]), ServiceTypeFile, Price.createPricing)
  .put(authorize([Enum.ROLES.ADMIN]), ServiceTypeFile, Price.updatePricing)
  .delete(authorize([Enum.ROLES.ADMIN]), Price.deletePricing)

Router.route('/vehicle/user/:userId?').get(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  vehicle.getUserVehicle
)

Router.route('/vehicle/list').get(vehicle.listAllVehicles)
Router.route('/vehicle/active').get(addAuth([Enum.ROLES.ADMIN, Enum.ROLES.USER]), vehicle.activeVehicle)
Router.route('/vehicle/:vehicleId?')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), vehicle.getVehicle)
  .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), vehicle.createVehicle)
  .put(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), vehicle.updateVehicle)
  .delete(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), vehicle.deleteVechicle)

Router.route('/coupon/:couponId?')
  .post(authorize([Enum.ROLES.ADMIN]), CouponModule.addCoupon)
  .get(authorize([Enum.ROLES.ADMIN]), CouponModule.getCoupon)
  .put(authorize([Enum.ROLES.ADMIN]), CouponModule.updateCoupon)
  .delete(authorize([Enum.ROLES.ADMIN]), CouponModule.deleteCoupon)

Router.route('/offer/:offerId?')
  .post(authorize([Enum.ROLES.ADMIN]), OfferFile, OfferModule.addOffer)
  .get(authorize([Enum.ROLES.ADMIN]), OfferModule.getOffer)
  .put(authorize([Enum.ROLES.ADMIN]), OfferFile, OfferModule.updateOffer)
  .delete(authorize([Enum.ROLES.ADMIN]), OfferModule.deleteOffer)

Router.route('/offerList').get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), OfferModule.getOfferList)

export { Router as Creteria }
