/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import express from 'express'
import { AuthMiddleware } from '../../middlewares/AuthMiddleware.js'
import { SuggestionController as Suggestions } from './SuggestionController.js'
import { Enum } from '../../utils/Enum.js'
const { authorize } = AuthMiddleware

const router = express.Router()

router
  .route('/suggestion')
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Suggestions.getSuggestions)
  .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Suggestions.addSuggestions)

export { router as Suggestions }
