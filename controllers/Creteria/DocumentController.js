/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'

import { BaseController } from '../BaseController.js'

import { DocumentConfig } from '../../config/DocumentConfig.js'

import { documentValidator } from '../../validators/Creteria/documentValidator.js'
import { CreteriaService } from '../../services/Creteria/CreteriaServices.js'

// import request from 'request'
import { BadRequestError, NotFoundError, UnprocessableError } from '../../utils/ErrorHandler.js'
import { RequestHandler } from '../../utils/RequestHandler.js'
import { Logger } from '../../utils/Logger.js'
import { Enum } from '../../utils/Enum.js'

import User from '../../models/Auth/User.js'
import Vehicle from '../../models/Creteria/Vehicle.js'

const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class DocumentController extends BaseController {
  constructor() {
    super()
  }

  static parseDocument = async (documentType, inputDocument, additionalData) => {
    let parseDocument = []
    try {
      const settings = DocumentConfig[documentType]
      if (!settings) throw new NotFoundError('NOT_FOUND|DOCUMENT TYPE')
      const documentData = JSON.parse(JSON.stringify(settings)) // Deep clone the array
      for (const document of documentData) {
        document.dataType = documentType
        document.reason = ''
        const documentIndex = inputDocument.findIndex((i) => i.name === document.indexName)
        if (documentIndex != -1) {
          const actualDocument = inputDocument[documentIndex]
          const addPath = additionalData && additionalData.addPath ? additionalData.addPath : ''
          document.isUploaded = true
          document.status = actualDocument.status
          document.reason = actualDocument.reason || ''
          if (document.fields) {
            for (const field of document.fields) {
              if (actualDocument.fields) {
                const fieldIndex = actualDocument.fields.findIndex((i) => i.name == field.indexName)
                if (fieldIndex != -1) {
                  if (field.type == 'image') {
                    field.value = `${document.storage}/${addPath}/${actualDocument.fields[fieldIndex].value}`
                  } else {
                    field.value = actualDocument.fields[fieldIndex].value
                  }
                }
              }
            }
          }
        } else {
          document.isUploaded = false
          document.status = 'needAction'
          document.reason = ''
        }
        delete document['storage']
        parseDocument.push(document)
      }
    } catch (error) {
      console.error('PARSE_DOCUMENT_ERROR: ', error)
      parseDocument = []
    }
    return parseDocument
  }

  static uploadDocument = async (req, res) => {
    try {
      const body = req.body
      const authData = req.auth || {}
      const userId =
        authData.role == Enum.ROLES.USER ? authData.userId : mongoose.Types.ObjectId(req.params.userId)

      const validation = await documentValidator.documentValidate(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const userData = await User.findOne({ _id: userId })
      if (!userData) throw new NotFoundError('NOT_FOUND|USER')

      const fieldName = body.fieldName
      const documentIndex = DocumentConfig.user.findIndex((el) => el.indexName == fieldName)

      if (documentIndex == -1) throw new NotFoundError('NOT_FOUND|DOCUMENT')
      const documentData = { ...DocumentConfig.user[documentIndex] }
      body['files'] = req.files
      const resData = await CreteriaService.uploadDoc(
        documentData,
        `./${documentData.storage}/${userData._id}/`,
        body,
        userData.document
      )
      if (resData.status == false) throw new BadRequestError('FAILED|DOCUMENT UPLOAD')
      const findFieldName = await User.findOne({
        _id: userId,
        document: { $elemMatch: { name: fieldName } }
      })

      let updateQuery = {}
      let findQuery = {}

      if (!findFieldName) {
        updateQuery = {
          $push: {
            document: {
              name: body.fieldName,
              // status: resData['data'].findFile.status,
              // reason: resData['data'].findFile.reason,
              fields: resData['data'].fieldArr
            }
          }
        }
        findQuery = {
          _id: userId
        }
      } else {
        updateQuery = {
          $set: {
            'document.$.name': fieldName,
            'document.$.status': resData['data'].findFile.status,
            'document.$.reason': resData['data'].findFile.reason,
            'document.$.fields': resData['data'].fieldArr
          }
        }
        findQuery = {
          _id: userId,
          'document.name': fieldName
        }
      }

      const updateData = await User.findOneAndUpdate(findQuery, updateQuery, { new: true })

      if (updateData) {
        if (resData['data'].removeOldFiles.length > 0) {
          resData['data'].removeOldFiles.forEach(async (e) => await CreteriaService.removeFile(e))
        }
      }

      const userDocs = updateData.document.length > 0 ? updateData.document : []
      const getParseDocument = await this.parseDocument('user', userDocs, { addPath: userId })

      return requestHandler.sendSuccess(
        req,
        res,
        'UPLOAD_DOCUMENT'
      )({ message: 'UPDATED|DOCUMENT', documents: getParseDocument })
    } catch (error) {
      console.error('UPLOAD_DOCUMENT_ERROR: ', error)
      return requestHandler.sendError(req, res, error)
    }
  }

  static getUserDocuments = async (req, res) => {
    try {
      const authData = req.auth || {}
      const userId =
        authData.role == Enum.ROLES.USER ? authData.userId : mongoose.Types.ObjectId(req.params.userId)

      const userData = await User.findOne({ _id: userId }).lean().exec()
      if (!userData) throw new NotFoundError('NOT_FOUND|USER')
      const userDocs = userData.document.length > 0 ? userData.document : []
      const getParseDocument = await this.parseDocument('user', userDocs, { addPath: userId })

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_USER_DOCUMENTS'
      )({ message: 'PROVIDED|USER DOCUMENTS', documents: getParseDocument })
    } catch (error) {
      console.error('GET_USER_DOCUMENTS_ERROR: ', error)
      return requestHandler.sendError(req, res, error)
    }
  }

  static uploadVehicleDocument = async (req, res) => {
    try {
      const body = req.body
      const params = req.params
      const authData = req.auth || {}

      const userId =
        authData.role == Enum.ROLES.USER ? authData.userId : mongoose.Types.ObjectId(params.userId)
      const vehicleId = params.vehicleId

      const validation = await documentValidator.vehicleDocumentValidate(body)
      console.log('validation', validation)

      if (!validation.status) return requestHandler.sendError(req, res, validation.data)

      const vehicleData = await Vehicle.findOne({
        _id: vehicleId,
        $or: [{ ownerId: userId }, { userId: userId }]
      })
      if (!vehicleData) throw new NotFoundError('NOT_FOUND|VEHICLE')

      console.log('vehicleData', vehicleData)

      const fieldName = body.fieldName
      const documentIndex = DocumentConfig.vehicle.findIndex((el) => el.indexName == fieldName)

      if (documentIndex == -1) throw new NotFoundError('NOT_FOUND|DOCUMENT')
      const documentData = { ...DocumentConfig.vehicle[documentIndex] }
      body['files'] = req.files
      console.log('documentData', documentData)

      const resData = await CreteriaService.uploadDoc(
        documentData,
        `./${documentData.storage}/${vehicleData._id}/`,
        body,
        vehicleData.document
      )

      console.log('resData', resData)

      if (resData.status == false) throw new BadRequestError('FAILED|DOCUMENT UPLOAD')
      const findFieldName = await Vehicle.findOne({
        _id: vehicleId,
        $or: [{ ownerId: userId }, { userId }],
        document: { $elemMatch: { name: fieldName } }
      })

      let updateQuery = {}
      const findQuery = {
        _id: vehicleId,
        $or: [{ ownerId: userId }, { userId }]
      }

      if (!findFieldName) {
        updateQuery = {
          $push: {
            document: {
              name: body.fieldName,
              // status: resData['data'].findFile.status,
              // reason: resData['data'].findFile.reason,
              fields: resData['data'].fieldArr
            }
          }
        }
      } else {
        updateQuery = {
          $set: {
            'document.$.name': fieldName,
            'document.$.status': resData['data'].findFile.status,
            'document.$.reason': resData['data'].findFile.reason,
            'document.$.fields': resData['data'].fieldArr
          }
        }
        findQuery['document.name'] = fieldName
      }

      const updateData = await Vehicle.findOneAndUpdate(findQuery, updateQuery, { new: true })
      if (updateData) {
        if (resData['data'].removeOldFiles.length > 0) {
          resData['data'].removeOldFiles.forEach(async (e) => await CreteriaService.removeFile(e))
        }
      }
      const vehicleDocs = updateData.document.length > 0 ? updateData.document : []
      const getParseDocument = await this.parseDocument('vehicle', vehicleDocs, { addPath: vehicleId })

      return requestHandler.sendSuccess(
        req,
        res,
        'UPLOAD_VEHICLE_DOCUMENT'
      )({ message: 'UPDATED|DOCUMENT', documents: getParseDocument })
    } catch (error) {
      console.log('error', error)

      return requestHandler.sendError(req, res, error)
    }
  }

  static getvehicleDocuments = async (req, res) => {
    try {
      const authData = req.auth || {}
      const params = req.params

      const userId =
        authData.role == Enum.ROLES.USER ? authData.userId : mongoose.Types.ObjectId(params.userId)
      const vehicleId = params.vehicleId
      const vehicleData = await Vehicle.findOne({
        _id: vehicleId,
        $or: [{ ownerId: userId }, { userId }]
      })
        .lean()
        .exec()
      if (!vehicleData) throw new NotFoundError('NOT_FOUND|VEHICLE')
      const vehicleDocs = vehicleData.document.length > 0 ? vehicleData.document : []
      const getParseDocument = await this.parseDocument('vehicle', vehicleDocs, { addPath: vehicleId })
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_VEHICLE_DOCUMENT'
      )({ message: 'PROVIDED|VEHICLE DATA', documents: getParseDocument })
    } catch (error) {
      console.log('error', error)

      return requestHandler.sendError(req, res, error)
    }
  }

  static updateDocStatus = async (req, res) => {
    try {
      const { userId = '', name = '', docFor = '', vehicleId = '', status = '', reason = '' } = req.body
      let docName = ''

      console.log('req.body', req.body)

      let docsData = []
      if (docFor == 'vehicleDocs') {
        const vehicle = await Vehicle.findOne({ _id: mongoose.Types.ObjectId(vehicleId) }).exec()
        if (!vehicle) throw new NotFoundError('NOT_FOUND|VEHICLE')
        const updateVehicleDocs = await Vehicle.findOneAndUpdate(
          { _id: vehicleId, document: { $elemMatch: { name: name } } },
          {
            $set: {
              'document.$.status': status,
              'document.$.reason': reason
            }
          },
          { new: true }
        ).exec()

        console.log('updateVehicleDocs', updateVehicleDocs)

        if (!updateVehicleDocs) throw new BadRequestError('FAILED|VEHICLE UPDATE')
        docsData = updateVehicleDocs.document || []
        docName = 'USER'
      } else {
        const user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) }).exec()
        if (!user) throw new BadRequestError('NOT_FOUND|USER')
        const updateDocs = await User.findOneAndUpdate(
          { _id: userId, document: { $elemMatch: { name: name } } },
          {
            $set: {
              'document.$.status': status,
              'document.$.reason': reason
            }
          },
          { new: true }
        ).exec()

        if (!updateDocs) throw new BadRequestError('FAILED|USER UPDATE')

        docsData = updateDocs.document || []
        docName = 'VEHICLE'
      }
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_STATUS'
      )({ message: `UPDATED|${docName}_DOCUMENT`, documents: docsData })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
}

export { DocumentController }
