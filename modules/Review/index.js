/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import express from 'express'
import { ReviewController as Reviews } from './ReviewController.js'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware.js'
import { Enum } from '../../utils/Enum.js'
const { authorize } = AuthMiddleware

const router = express.Router()

router
  .route('/reviews')
  .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Reviews.addRating)
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Reviews.getRating)

export { router as Review }
