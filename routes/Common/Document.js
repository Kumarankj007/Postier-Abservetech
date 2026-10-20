/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import * as express from 'express'
import { Enum } from '../../utils/Enum.js'

import { DocumentController as Document } from '../../controllers/Creteria/DocumentController.js'

import { AuthMiddleware } from '../../middlewares/AuthMiddleware.js'
const { authorize } = AuthMiddleware

import { UploadMiddlewware } from '../../middlewares/UploadMiddleware.js'

const DocumentFile = new UploadMiddlewware({ path: './public/Auth/Users' }).unknownFields

const Router = express.Router()

Router.route('/common/document/user/:userId?')
  .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), DocumentFile, Document.uploadDocument)
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.USER]), Document.getUserDocuments)

Router.route('/common/document/vehicle/:userId?/:vehicleId?')
  .post(authorize([Enum.ROLES.ADMIN, Enum.ROLES.PARTNER]), DocumentFile, Document.uploadVehicleDocument)
  .get(authorize([Enum.ROLES.ADMIN, Enum.ROLES.PARTNER]), Document.getvehicleDocuments)

Router.route('/common/document/updateStatus').patch(authorize([Enum.ROLES.ADMIN]), Document.updateDocStatus)

export { Router as Document }
