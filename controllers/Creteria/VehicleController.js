/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseController } from './../BaseController.js'
import Vehicle from '../../models/Creteria/Vehicle.js'
import User from '../../models/Auth/User.js'
import ServiceType from '../../models/Creteria/ServiceType.js'
import { RequestHandler } from './../../utils/RequestHandler.js'
import { Logger } from './../../utils/Logger.js'
import { VehicleValidator } from './../../validators/Creteria/VehicleValidator.js'
import mongoose from 'mongoose'
import { Enum } from '../../utils/Enum.js'
import { QueryBuilder } from '../../helpers/QueryBuilder.js'

import { NotFoundError, BadRequestError } from '../../utils/ErrorHandler.js'

const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class VehicleController extends BaseController {
  constructor() {
    super()
  }

  // Get all vechicle

  static getVehicle = async (req, res) => {
    try {
      const queryData = req.query
      const paramData = req.params
      const perPage = parseInt(queryData.limit) || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      const orCond = []

      let queryObject = {}
      console.log(queryData, 'queryData')

      const queryBuilder = await QueryBuilder.getSearchable(Vehicle, queryData)
      queryObject = queryBuilder.queryObject || queryObject
      queryObject['deletedAt'] = null

      if (paramData.vehicleId) {
        orCond.push(
          { _id: mongoose.Types.ObjectId(paramData.vehicleId) },
          { ownerId: mongoose.Types.ObjectId(paramData.vehicleId) }
        )
        queryObject['$or'] = orCond
      }
      const getDataCount = await Vehicle.find(queryObject).count()

      const makePipeline = [{ $eq: ['$$makesid', '$_id'] }]
      if (queryData.makename) makePipeline.push({ $eq: ['$$name', queryData.makename] })

      const modelPipeline = [{ $eq: ['$$modelid', '$_id'] }]
      if (queryData.modelname) modelPipeline.push({ $eq: ['$$name', queryData.modelname] })

      const pipeline = [
        { $match: queryObject },
        {
          $lookup: {
            from: 'makes',
            let: { makesid: '$makeid' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: makePipeline
                  }
                }
              }
            ],
            as: 'makeinfo'
          }
        },
        {
          $unwind: {
            path: '$makeinfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'models',
            let: { modelid: '$model' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: modelPipeline
                  }
                }
              }
            ],
            as: 'modelinfo'
          }
        },
        {
          $unwind: {
            path: '$modelinfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            localField: 'servicetype',
            from: 'servicetypes',
            foreignField: '_id',
            as: 'servicetypeinfo'
          }
        },
        {
          $unwind: {
            path: '$servicetypeinfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            localField: 'userId',
            from: 'users',
            foreignField: '_id',
            as: 'userinfo'
          }
        },
        {
          $unwind: {
            path: '$userinfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'companys',
            let: { ownerId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$ownerType', 'USER']
                  }
                }
              }
              // {
              //   $lookup: {
              //     from: 'users',
              //     localField: 'ownerId',
              //     foreignField: '_id',
              //     as: 'usersdata',
              //   },
              // },
            ],
            as: 'companyinfo'
          }
        },
        {
          $unwind: {
            path: '$companyinfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            ownerId: 1,
            usersdata: 1,
            companyinfo: 1,
            ownername: '$companyinfo.name',
            ownerType: 1,
            userId: 1,
            username: '$userinfo.fname',
            registrationnumber: 1,
            makeid: 1,
            capacity: 1,
            makename: '$makeinfo.name',
            model: 1,
            modelname: '$modelinfo.name',
            year: 1,
            color: 1,
            servicetype: 1,
            servicetypename: '$servicetypeinfo.name',
            status: 1,
            deletedAt: 1,
            document: 1,
            events: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1
          }
        }
      ]
      const getData = await Vehicle.aggregate(pipeline).sort({ _id: -1 }).skip(skip).limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_VEHICLE'
      )({ message: 'LISTED|VEHICLES', Vehicle: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getUserVehicle = async (req, res) => {
    try {
      // const queryData = req.query

      // const perPage = queryData.limit || 10
      // const page = queryData.page || 1
      // const skip = perPage * page - perPage || 0
      const authData = req.auth
      const userId =
        authData.role == Enum.ROLES.USER ? authData.userId : mongoose.Types.ObjectId(req.params.USERId)

      const queryObj = {
        userId: userId,
        deletedAt: null
      }

      const getDataCount = await Vehicle.find(queryObj).count()

      const getData = await Vehicle.aggregate([
        { $match: queryObj },
        {
          $lookup: {
            localField: 'makeid',
            from: 'makes',
            foreignField: '_id',
            as: 'makeinfo'
          }
        },
        {
          $unwind: {
            path: '$makeinfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            localField: 'model',
            from: 'models',
            foreignField: '_id',
            as: 'modelinfo'
          }
        },
        {
          $unwind: {
            path: '$modelinfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            localField: 'servicetype',
            from: 'servicetypes',
            foreignField: '_id',
            as: 'servicetypeinfo'
          }
        },
        {
          $unwind: {
            path: '$servicetypeinfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            localField: 'userId',
            from: 'users',
            foreignField: '_id',
            as: 'userinfo'
          }
        },
        {
          $unwind: {
            path: '$userinfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            document: {
              $map: {
                input: '$document',
                as: 'doc',
                in: {
                  name: '$$doc.name',
                  status: '$$doc.status',
                  reason: '$$doc.reason',
                  fields: {
                    $map: {
                      input: '$$doc.fields',
                      as: 'field',
                      in: {
                        name: '$$field.name',
                        value: '$$field.value',
                        status: '$$field.status',
                        reason: '$$field.reason',
                        path: {
                          $concat: ['public/Auth/Vehicles/', { $toString: '$_id' }, '/', '$$field.value']
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        {
          $project: {
            _id: 1,
            ownerId: 1,
            ownerType: 1,
            userId: 1,
            username: '$userinfo.fname',
            registrationnumber: 1,
            makeid: 1,
            capacity: 1,
            makename: '$makeinfo.name',
            model: 1,
            modelname: '$modelinfo.name',
            year: 1,
            color: 1,
            servicetype: 1,
            servicetypename: '$servicetypeinfo.name',
            way: '$servicetypeinfo.way',
            status: 1,
            deletedAt: 1,
            document: 1,
            events: 1,
            createdAt: 1,
            updatedAt: 1,
            __v: 1
          }
        }
      ])
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_USER_VEHICLE'
      )({ message: 'LISTED|USER_VEHICLE', Vehicle: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static createVehicle = async (req, res) => {
    try {
      const body = req.body
      const auth = req.auth
      const validation = await VehicleValidator.createVehicle(body)
      if (!validation.status) return requestHandler.sendError(req, res, validation.data)

      const checkData = await Vehicle.findOne({ registrationnumber: body.registrationnumber }).lean().exec()
      if (checkData) throw new BadRequestError('EXIST|VEHICLE ALREADY')

      let ownerId = null
      let ownerType = null
      let userId = null

      if (auth.role == Enum.ROLES.ADMIN) {
        ownerId = body.ownerId
        ownerType = body.ownerType
        userId = body.userId
      } else {
        ownerId = auth.userId
        ownerType = auth.role
        userId = auth.userId
      }

      // Restrict adding more than one vehicle
      // const checkVehicle = await Vehicle.findOne({ userId }).lean().exec()
      // if (checkVehicle) return requestHandler.sendError(req, res, 'CANT_ADD_MORE_THAN_ONE_VEHICLE')

      const newDoc = new Vehicle({
        ownerId: ownerId,
        ownerType: ownerType,
        userId: userId,
        registrationnumber: body.registrationnumber,
        makeid: mongoose.Types.ObjectId(body.makeid) || null,
        model: mongoose.Types.ObjectId(body.model) || null,
        year: body.year,
        color: body.color,
        capacity: body.capacity,
        servicetype: mongoose.Types.ObjectId(body.servicetype)
      })

      const createVehicle = await newDoc.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_VEHICLE'
      )({ message: 'CREATED|VEHICLE', Vehicle: createVehicle })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateVehicle = async (req, res) => {
    try {
      const body = req.body
      const auth = req.auth
      const validation = await VehicleValidator.updateVehicle(body)
      if (!validation.status) return requestHandler.sendError(req, res, validation.data)

      const vehicleId = req.params.vehicleId

      // const checkData = await Vehicle.findOne({
      //   _id: { $ne: mongoose.Types.ObjectId(vehicleId) },
      //   registrationnumber: body.registrationnumber
      // })
      //   .lean()
      //   .exec()
      // if (checkData) return requestHandler.sendError(req, res, 'VEHICLE_ALREADY_EXISTS')

      const vehicleData = await Vehicle.findOne({ _id: mongoose.Types.ObjectId(vehicleId) })
      if (!vehicleData) throw new BadRequestError('NOT_FOUND|VEHICLE')

      let ownerId
      let ownerType
      if (auth.role == Enum.ROLES.ADMIN || auth.role == Enum.ROLES.USER) {
        ownerId = body.ownerId
        ownerType = body.ownerType
      } else {
        ownerId = req.auth.ownerId
        ownerType = req.auth.role
      }

      vehicleData.ownerId = ownerId || vehicleData.ownerId
      vehicleData.ownerType = ownerType || vehicleData.ownerType

      vehicleData.userId = body.userId || vehicleData.userId
      vehicleData.registrationnumber = body.registrationnumber || vehicleData.registrationnumber
      vehicleData.capacity = body.capacity || vehicleData.capacity
      vehicleData.makeid = body.makeid || vehicleData.makeid
      vehicleData.model = body.model || vehicleData.model
      vehicleData.year = body.year || vehicleData.year
      vehicleData.color = body.color || vehicleData.color

      // In future we have to work
      // vehicleData.servicetype = body.servicetype || vehicleData.servicetype

      vehicleData.status = body.status || vehicleData.status
      vehicleData.updatedBy.userId = req.auth.userId || vehicleData.updatedBy.userId
      vehicleData.updatedBy.role = req.auth.role || vehicleData.updatedBy.role
      const vehicleDataUpdated = await vehicleData.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_VEHICLE'
      )({ message: 'UPDATED|VEHICLE', vehicleData: vehicleDataUpdated })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteVechicle = async (req, res) => {
    try {
      const vehicleData = await Vehicle.findOne({ _id: mongoose.Types.ObjectId(req.params.vehicleId) })
      if (!vehicleData) throw new NotFoundError('NOT_FOUND|VEHICLE')

      vehicleData.deletedAt = new Date()
      const vehicleDataUpdated = await vehicleData.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_VEHICLE'
      )({ message: 'DELETED|VEHICLE', vehicleData: vehicleDataUpdated })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static listAllVehicles = async (req, res) => {
    try {
      const queryData = req.query

      const queryObj = {}
      if (queryData.registrationnumber) {
        queryObj.registrationnumber = { $regex: queryData.registrationnumber, $options: 'i' }
      }
      const getDataCount = await Vehicle.find(queryObj).count()
      const getData = await Vehicle.find(queryObj).exec()
      return requestHandler.sendSuccess(
        req,
        res,
        'LIST_ALL_VEHICLE'
      )({ message: 'LISTED|VEHICLE', vehicles: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static activeVehicle = async (req, res) => {
    try {
      const params = req.query
      const Auth = req.auth

      let userId = Auth.userId
      if (Auth && Auth.role == Enum.ROLES.ADMIN) userId = params.userId

      const vehicleId = params.vehicleId
      if (!vehicleId) throw new BadRequestError('REQUIRED|VEHICLE ID')

      const vehicleData = await Vehicle.findOne({ $and: [{ userId: userId }, { _id: vehicleId }] })
      if (!vehicleData) throw new BadRequestError('NOT_FOUND|VEHICLE')

      const serviceData = await ServiceType.findOne({ _id: vehicleData.servicetype }).exec()
      if (!serviceData) throw new BadRequestError('NOT_FOUND|SERVICE TYPE')

      for (const itreator of vehicleData.document) {
        if (itreator.status == 'pending' || itreator.status == 'rejected') {
          throw new BadRequestError('YOUR_VEHICLE_DOCUMENT_IS_NOT_APPROVED')
        }
      }

      const updateActive = await Vehicle.findOneAndUpdate(
        { _id: vehicleId },
        {
          $set: {
            status: 'active'
          }
        },
        {
          new: true
        }
      )

      await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            activeVechicle: vehicleId,
            curService: serviceData._id
          }
        },
        {
          new: true
        }
      )
      if (updateActive.status != 'active') throw new BadRequestError('FAILED|VEHICLE UPDATE')

      const otherVehicles = await Vehicle.find({ userId: userId, _id: { $ne: vehicleId } })
      if (updateActive.status == 'active' && otherVehicles.length > 1) {
        const updateInactive = await Vehicle.updateMany(
          { _id: { $ne: vehicleId }, userId: userId },
          {
            $set: {
              status: 'inactive'
            }
          }
        )
        if (updateInactive.modifiedCount == 0) {
          await Vehicle.updateOne(
            { _id: vehicleId },
            {
              $set: {
                status: 'inactive'
              }
            }
          )
          await User.findOneAndUpdate(
            { _id: userId },
            {
              $set: {
                activeVechicle: null
              }
            },
            {
              new: true
            }
          )
          throw new BadRequestError('FAILED|VEHICLE UPDATE')
        }
      }

      return requestHandler.sendSuccess(req, res, 'ACTIVE_VEHICLE')({ message: 'SUCCESS|VEHICLE SWITCHING' })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }
}

export { VehicleController }
