/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseController } from '../BaseController.js'
import EmailTemplate from '../../models/Notification/EmailTemplate.js'
import { RequestHandler } from '../../utils/RequestHandler.js'
import { Logger } from '../../utils/Logger.js'
import { BadRequestError, NotFoundError } from '../../utils/ErrorHandler.js'

const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class mailTemplate extends BaseController {
  constructor() {
    super()
  }
  static createTemplate = async (req, res) => {
    try {
      const body = req.body

      const createObj = {
        subject: body.subject,
        description: body.description,
        body: body.body,
        status: body.status,
        header: body.header,
        language: body.language
      }

      const checkExist = await EmailTemplate.findOne({ subject: body.subject, language: body.language })
      if (checkExist) throw new BadRequestError('TEMPLATE_ALREADY_EXISTS')

      const createData = await EmailTemplate.create(createObj)
      if (!createData) throw new BadRequestError('SOMETHING_WENT_WRONG')

      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_TEMPLATE'
      )({ message: 'CREATED|TEMPLATE', documents: createData })
    } catch (error) {
      return requestHandler.sendError(req, res, Error)
    }
  }

  static getTemplates = async (req, res) => {
    try {
      let findCond = { deletedAt: null }
      if (req.params.templateId) {
        findCond = { _id: req.params.templateId }
      }
      const getData = await EmailTemplate.find(findCond)
      if (!getData.length) throw new NotFoundError('NOT_FOUND|TEMPLATE')

      return requestHandler.sendSuccess(req, res, 'GET_TEMPLATES')({ message: 'SUCCESS', documents: getData })
    } catch (error) {
      return requestHandler.sendError(req, res, Error)
    }
  }

  static updateTemplate = async (req, res) => {
    try {
      const { body } = req.body
      const { templateId } = req.params
      const updateData = await EmailTemplate.findOne({ _id: templateId })
      if (!updateData) throw new NotFoundError('NOT_FOUND|TEMPLATE')

      updateData.subject = body.subject || updateData.subject
      updateData.description = body.description || updateData.description
      updateData.body = body.body || updateData.body
      updateData.status = body.status ? body.status : false
      updateData.header = body.header || updateData.header
      updateData.language = body.language || updateData.language

      const updatedTemplate = await updateData.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_TEMPLATE'
      )({ message: 'UPDATED|TEMPLATE', documents: updatedTemplate })
    } catch (error) {
      return requestHandler.sendError(req, res, Error)
    }
  }

  static deleteTemplate = async (req, res) => {
    try {
      const { templateId } = req.params

      const deletedTemplate = await EmailTemplate.findOneAndUpdate(
        { _id: templateId },
        { deletedAt: new Date() },
        { new: true }
      )
      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_TEMPLATE'
      )({ message: 'DELETED|TEMPLATE', deletedData: deletedTemplate })
    } catch (error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
}

export { mailTemplate }
