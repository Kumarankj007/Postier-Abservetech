/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import * as express from 'express'
import { TripController as Trip } from '../../controllers/Service/TripController.js'
import { Enum } from '../../utils/Enum.js'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware.js'
const { authorize } = AuthMiddleware

const Router = express.Router()

// TRIP's API's
// Homepage
Router.route('/common/trip/search').get(Trip.searchForTrips)
Router.route('/common/trip/detail/:tripId').get(Trip.getDetailTrip)

// Estimate
Router.route('/common/trip/estimation').post(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  Trip.getTripEstimation
)

// Get post By Trip
Router.route('/common/postByTripId/:id?').get(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  Trip.getPostByTripID
)

// CRUD
Router.route('/common/trip/:tripId?')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Trip.getTrip)
  .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Trip.createTrip)
  .put(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Trip.updateTrip)
  .delete(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Trip.deleteTrip)

// Publish Trip
Router.route('/common/publishTrip/:tripId?').put(
  authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]),
  Trip.publishTrip
)

// Get Review
Router.route('/common/tripReview/:tripId').get(Trip.getTripReviews)

// Get Routes
Router.route('/common/getRoutes').get(Trip.getRoutesForTrip)

// Get Single Route
Router.route('/common/getRoute/:routeId').get(Trip.getSingleRoute)

export { Router as Trip }
