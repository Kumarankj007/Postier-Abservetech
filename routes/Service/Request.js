/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import * as express from 'express'
import { RequestController as Request } from '../../controllers/Service/RequestController.js'
import { Enum } from '../../utils/Enum.js'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware.js'
const { authorize } = AuthMiddleware

const Router = express.Router()

// REQUEST API's
Router.route('/common/request/:tripId/:postId')
  .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Request.createRequest)
  .put(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Request.updateRequest)
Router.route('/common/trackingStatus/:tripId/:postId').put(authorize([Enum.ROLES.USER]))

// Tracking Status
Router.route('/common/trackingStatus/:tripId/:postId').put(
  authorize([Enum.ROLES.USER]),
  Request.updateTrackingStatus
)

// Trip Status Updation
Router.route('/common/tripStatus/:tripId').put(authorize([Enum.ROLES.USER]), Request.updateTripStatus)

// Find Nearest Match Postiers
Router.route('/common/findTrips/:postId/:tripId?').get(authorize(Enum.ROLES.USER), Request.findTrips)

// Find Nearest Match Users
Router.route('/common/findPosts/:tripId/:postId?').get(Request.findPosts)

// Get My Requests
Router.route('/common/requests').get(authorize([Enum.ROLES.USER]), Request.getRequests)

// Get Receiver Tracking
Router.route('/common/receiverTracking').get(Request.receiverTracking)

// Get Dynamic Calculation
Router.route('/common/dynamicCalculation').post(Request.dynamicCalculation)

export { Router as Request }
