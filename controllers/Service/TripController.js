/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'
import { BaseController } from '../BaseController.js'

import Trip from '../../models/Service/Trip.js'
import Post from '../../models/Service/Post.js'
import User from '../../models/Auth/User.js'
import Review from '../../modules/Review/Review.js'
import { TripValidator } from '../../validators/Service/TripValidator.js'
import { RequestHandler } from '../../utils/RequestHandler.js'
import { Logger } from '../../utils/Logger.js'
import { Enum } from '../../utils/Enum.js'
import { NotifcationController } from '../Notification/Index.js'
import { NotFoundError, UnprocessableError, BadRequestError } from '../../utils/ErrorHandler.js'
import RoutePath from '../../modules/Map/RoutePath.js'
import { MapServices } from '../../modules/Map/index.js'
import { AuthServices } from '../../services/Common/AuthService.js'
import Vehicle from '../../models/Creteria/Vehicle.js'
import * as turf from '@turf/turf'
import { Config } from '../../config/AppConfig.js'
import Pricing from '../../models/Creteria/Pricing.js'
import { Helpers } from '../../helpers/Function.js'
import geolib from 'geolib'

const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class TripController extends BaseController {
  constructor() {
    super()
  }
  static getTrip = async (req, res) => {
    try {
      const queryData = req.query
      const paramData = req.params

      const perPage = Number(queryData.limit) || 10
      const page = Number(queryData.page) || 1
      const skip = perPage * page - perPage || 0
      const sortOrder = paramData.sortOrder?.toLowerCase() === 'asc' ? 1 : -1
      const pipeline = []
      const matchQuery = { deletedAt: null }
      const matchPipeline = {
        $match: matchQuery
      }
      if (paramData.tripId) matchQuery._id = mongoose.Types.ObjectId(paramData.tripId)

      const validation = await TripValidator.getTrip(queryData)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      if (queryData.startLng && queryData.startLat && queryData.endLng && queryData.endLat) {
        const startCoords = [parseFloat(queryData.startLng), parseFloat(queryData.startLat)]
        const endCoords = [parseFloat(queryData.endLng), parseFloat(queryData.endLat)]

        const queryVector = await MapServices.getVector(startCoords, endCoords)
        if (!queryVector.status) throw new BadRequestError(queryVector.message)
        // Should take distance from .env / config
        const maxDistanceInRadians = 20 / 6378.1

        const results = await RoutePath.aggregate([
          {
            $match: {
              $and: [
                {
                  'route.coordinates': {
                    $geoWithin: { $centerSphere: [startCoords, maxDistanceInRadians] }
                  }
                },
                {
                  'route.coordinates': {
                    $geoWithin: { $centerSphere: [endCoords, maxDistanceInRadians] }
                  }
                }
              ]
            }
          },
          {
            $match: {
              $expr: {
                $gt: [
                  {
                    $add: [
                      { $multiply: [queryVector.data.x, '$vector.x'] },
                      { $multiply: [queryVector.data.y, '$vector.y'] }
                    ]
                  },
                  0
                ]
              }
            }
          },
          {
            $project: {
              _id: 1
            }
          }
        ])

        const waypointsArr = await Promise.all(results.map((data) => data._id))
        matchQuery['wayPointId'] = { $in: waypointsArr }
      }

      if (queryData.search) {
        const searchRegex = { $regex: queryData.search, $options: 'i' }
        matchQuery.$or = [
          { 'postier.fname': searchRegex },
          { 'postier.lname': searchRegex },
          { 'postier.email': searchRegex },
          { 'postier.phone': searchRegex }
        ]
      }

      if (queryData.pickupDate) {
        const startDate = new Date(queryData.pickupDate)
        const dayStart = startDate.setHours(0, 0, 0, 0)
        const dayEnd = startDate.setHours(23, 59, 59, 999)
        matchQuery.pickupDate = { $gte: new Date(dayStart), $lte: new Date(dayEnd) }
      }

      if (queryData.deliveryDate) {
        const endDate = new Date(queryData.deliveryDate)
        const dayStart = endDate.setHours(0, 0, 0, 0)
        const dayEnd = endDate.setHours(23, 59, 59, 999)
        matchQuery.deliveryDate = { $gte: new Date(dayStart), $lte: new Date(dayEnd) }
      }

      if (
        [
          Enum.TRIP.STATUS.PENDING,
          Enum.TRIP.STATUS.PUBLISHED,
          Enum.TRIP.STATUS.TRANSIT,
          Enum.TRIP.STATUS.FINISHED,
          Enum.TRIP.STATUS.CANCELLED,
          Enum.TRIP.STATUS.DELIVERED
        ].includes(queryData.status)
      ) {
        matchQuery['status'] = queryData.status
      }

      if (req.auth) {
        const userId = req.auth.role == Enum.ROLES.USER ? req.auth.userId : queryData.userId
        if (userId) {
          matchQuery.userId = mongoose.Types.ObjectId(userId)
        }
      }

      pipeline.push(matchPipeline)

      const countPipeline = [...pipeline, { $count: 'totalCount' }]
      const countResult = await Trip.aggregate(countPipeline)
      const getDataCount = countResult[0]?.totalCount || 0
      if (paramData.tripId) {
        const singleGetData = await Trip.aggregate([
          ...pipeline,
          { $sort: { _id: sortOrder } },
          { $skip: skip },
          { $limit: perPage }
        ])

        return requestHandler.sendSuccess(
          req,
          res,
          'GET_TRIP'
        )({
          message: 'SUCCESS',
          trip: singleGetData[0]
        })
      }
      const getData = await Trip.aggregate([
        ...pipeline,
        { $sort: { _id: sortOrder } },
        { $skip: skip },
        { $limit: perPage }
      ])

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_TRIP'
      )({
        message: 'SUCCESS',
        trips: getData,
        total: getDataCount
      })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Create Trip
  static createTrip = async (req, res) => {
    try {
      const body = req.body

      const validation = await TripValidator.createTrip(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const userData = await User.findOne({ _id: req.auth.userId })
      if (!userData) throw new NotFoundError('NOT_FOUND|USER')

      const vehicleData = await Vehicle.findOne({ _id: body.vehicleId, ownerId: req.auth.userId }).populate(
        'servicetype',
        'name'
      )

      if (!vehicleData) throw new NotFoundError('NOT_FOUND|VEHICLE')
      const vehicleFrontImage = vehicleData.document
        .find((vehicle) => vehicle.name === 'vehicleImage')
        ?.fields?.find((field) => field.name === 'frontImage')
      const vehicleBackImage = vehicleData.document
        .find((vehicle) => vehicle.name === 'vehicleImage')
        ?.fields?.find((field) => field.name === 'backImage')

      const module = await AuthServices.uniCodeGenerator('Trip')
      if (!module.status || !module.data.code) throw new BadRequestError('MODULE_CODE_NOT_GENERATED')

      const similarTrip = await Trip.findOne({
        userId: userData._id,
        pickupDate: body.pickupDate,
        status: {
          $in: [Enum.TRIP.STATUS.PENDING, Enum.TRIP.STATUS.TRANSIT]
        }
      }).exec()
      if (similarTrip) throw new BadRequestError('ALREADY_YOU_HAVE_ONE_TRIP')

      // const stopPointsArr = []

      // if (body.stopPointsArr && body.stopPointsArr.length) {
      //   for (const stopPoints of body.stopPointsArr) {
      //     stopPointsArr.push({
      //       name: stopPoints.name,
      //       city: stopPoints.city,
      //       coords: {
      //         type: 'Point',
      //         coordinates: [parseFloat(stopPoints.lng), parseFloat(stopPoints.lat)]
      //       },
      //       fare: stopPoints.fare
      //     })
      //   }
      // }

      // Process and Sort Stop Points
      const stopPointsArr = []
      const startCoords = {
        latitude: parseFloat(body.pickupLat),
        longitude: parseFloat(body.pickupLng)
      }

      if (body.stopPointsArr && body.stopPointsArr.length) {
        const mappedStopPoints = body.stopPointsArr.map((stopPoints) => {
          const stopCoords = {
            latitude: parseFloat(stopPoints.lat),
            longitude: parseFloat(stopPoints.lng)
          }
          const distance = geolib.getDistance(startCoords, stopCoords)

          return {
            name: stopPoints.name,
            placeId: stopPoints.placeId,
            city: stopPoints.city,
            coords: {
              type: 'Point',
              coordinates: [parseFloat(stopPoints.lng), parseFloat(stopPoints.lat)]
            },
            fare: stopPoints.fare,
            distance
          }
        })

        const sortedStopPoints = mappedStopPoints.sort((a, b) => a.distance - b.distance)

        sortedStopPoints.forEach((stopPoint) => {
          delete stopPoint.distance
          stopPointsArr.push(stopPoint)
        })
      }

      const addTrip = new Trip({
        uniCode: module.data.code,
        userId: userData._id,
        description: body.description,
        email: body.email,
        type: body.type,
        deliveryType: body.deliveryType,

        location: {
          pickUp: body.pickup,
          pickUpCity: body.pickUpCity,
          pickUpPlaceId: body.pickUpPlaceId,
          drop: body.drop,
          dropCity: body.dropCity,
          dropPlaceId: body.dropPlaceId,
          'startCoords.coordinates': [body.pickupLng, body.pickupLat],
          'endCoords.coordinates': [body.dropLng, body.dropLat]
        },

        postier: {
          email: userData.email,
          fname: userData.fname,
          lname: userData.lname,
          phoneCode: userData.phoneCode,
          phone: userData.phone,
          profile: userData.profile,
          status: userData.status,
          vehicleDetails: {
            _id: vehicleData._id,
            vehicleType: vehicleData.servicetype.name,
            vehicleFrontImage: `public/Auth/Vehicles/${vehicleData._id}/${vehicleFrontImage?.value}`,
            vehicleBackImage: `public/Auth/Vehicles/${vehicleData._id}/${vehicleBackImage?.value}`
          },
          ratings: {
            totalValue: userData.ratings.totalValue,
            totalCount: userData.ratings.totalCount
          }
        },
        pickupDate: body.pickupDate,
        deliveryDate: body.deliveryDate,
        capacity: body.capacity,
        availableCapacity: body.capacity,
        maxWeight: body.maxWeight,
        maxWidth: Number(body.maxWidth),
        maxHeight: Number(body.maxHeight),
        maxLength: Number(body.maxLength),
        dimensionType: 'Centi-Meter',
        instantBooking: body.instantBooking,
        avgPrice: body.avgPrice,
        suggestionId: body.suggestionId || null,
        scheduleLater: {
          status: body.isScheduleLater,
          time: body.scheduleTime ? new Date(body.scheduleTime) : null
        },
        wayPointId: body.wayPointId,
        status: body.status ? body.status : Enum.TRIP.STATUS.PUBLISHED,
        stopPoints: stopPointsArr
      })
      const tripData = await addTrip.save()
      await NotifcationController.createNotification({
        processType: [Enum.NOTIFICATION.TYPE.MAIL],
        data: {
          subject: 'Trip Created',
          email: userData.email,
          contentdata: {
            postierFirstName: userData.fname,
            tripTitle: tripData.description,
            pickupLocation: tripData.location.pickUp,
            dropoffLocation: tripData.location.drop,
            pickupDateTime: tripData.pickupDate,
            capacity: tripData.capacity,
            vehicleType: tripData.postier.vehicleDetails.vehicleType
          },
          description: 'tripCreated'
        }
      })

      // if (tripData.suggestionId) {
      //   const findPost = await Post.findOne({ _id: tripData.suggestionId })
      //   if (!findPost) {
      //     throw new NotFoundError('NOT_FOUND|POST')
      //   }
      //   const originCoordinates = [
      //     `${tripData.location.startCoords.coordinates[1]},${tripData.location.startCoords.coordinates[0]}`
      //   ]
      //   const destinationCoordinates = [
      //     `${findPost.location.startCoords.coordinates[1]},${findPost.location.startCoords.coordinates[0]}`
      //   ]
      //   const getDistance = await MapServices.calculateDistanceBetweenTwoPoints(
      //     originCoordinates,
      //     destinationCoordinates
      //   )
      //   const manipulatedBody = {
      //     postId: tripData.suggestionId,
      //     tripId: tripData._id,
      //     userId: tripData.userId,
      //     distance: getDistance * 1000
      //   }

      //   req.body = {
      //     ...req.body,
      //     ...manipulatedBody
      //   }
      //   await this.createRequest(req, res)
      //   return
      // }

      return requestHandler.sendSuccess(req, res, 'CREATE_TRIP')({ message: 'CREATED|TRIP', trip: tripData })
    } catch (error) {
      console.log('Error: createTrip', error)
      return requestHandler.sendError(req, res, error)
    }
  }

  // Update Trip
  static updateTrip = async (req, res) => {
    try {
      const body = req.body

      const tripId = req.params.tripId || body.tripId
      if (!tripId) throw new BadRequestError('UNPROCESSABLE_ENTRY')

      const validation = await TripValidator.updateTrip(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const getTrip = await Trip.findOne({ _id: tripId }).exec()

      if (!getTrip) throw new NotFoundError('TRIP_NOT_FOUND')

      const userData = await User.findOne({ _id: req.auth.userId })
      if (!userData) throw new NotFoundError('NOT_FOUND|USER')

      const stopPointsArr = getTrip.stopPoints?.length > 0 ? getTrip.stopPoints : []
      if (body.stopPointsArr && body.stopPointsArr.length) {
        const mappedStopPoints = body.stopPointsArr.map((stopPoints) => {
          return {
            name: stopPoints.name,
            city: stopPoints.city,
            coords: {
              type: 'Point',
              coordinates: [parseFloat(stopPoints.lng), parseFloat(stopPoints.lat)]
            },
            fare: stopPoints.fare
          }
        })
        stopPointsArr.push(...mappedStopPoints)
      }

      let startCoords = null
      if (body.pickupLat && body.pickupLng) startCoords = [body.pickupLng, body.pickupLat]

      let endCoords = null
      if (body.dropLat && body.dropLng) endCoords = [body.dropLng, body.dropLat]

      getTrip.description = body.description || getTrip.description
      getTrip.email = body.email || getTrip.email
      getTrip.type = body.type || getTrip.type
      getTrip.deliveryType = body.deliveryType || getTrip.deliveryType
      getTrip.location.pickUp = body.pickup || getTrip.location.pickUp
      getTrip.location.pickUpCity = body.pickUpCity || getTrip.location.pickUpCity
      getTrip.location.pickUpPlaceId = body.pickUpPlaceId || getTrip.location.pickUpPlaceId
      getTrip.location.drop = body.drop || getTrip.location.drop
      getTrip.location.dropCity = body.dropCity || getTrip.location.dropCity
      getTrip.location.dropPlaceId = body.dropPlaceId || getTrip.location.dropPlaceId

      getTrip.pickupDate = body.pickupDate || getTrip.pickupDate
      getTrip.deliveryDate = body.deliveryDate || getTrip.deliveryDate

      getTrip.capacity = body.capacity || getTrip.capacity
      getTrip.maxWeight = body.maxWeight || getTrip.maxWeight
      getTrip.maxWidth = Number(body.maxWidth) || getTrip.maxWidth
      getTrip.maxHeight = Number(body.maxHeight) || getTrip.maxHeight
      getTrip.maxLength = Number(body.maxLength) || getTrip.maxLength
      getTrip.dimensionType = body.dimensionType || getTrip.dimensionType
      getTrip.instantBooking = body.instantBooking || getTrip.instantBooking
      getTrip.avgPrice = body.avgPrice || getTrip.avgPrice
      getTrip.status = body.status || getTrip.status
      getTrip.scheduleLater.status = body.scheduleTime ? true : false
      getTrip.scheduleLater.time = body.scheduleTime
        ? new Date(body.scheduleTime)
        : getTrip.scheduleLater.time
      getTrip.stopPoints = body.stopPointsArr?.length > 0 ? stopPointsArr : getTrip.stopPoints

      if (startCoords || endCoords) {
        getTrip.location.startCoords.coordinates = startCoords || getTrip.location.startCoords.coordinates
        getTrip.location.endCoords.coordinates = endCoords || getTrip.location.endCoords.coordinates

        const locationData = await MapServices.getLocationData(
          [getTrip.location.startCoords.coordinates.reverse().join()],
          [getTrip.location.endCoords.coordinates.reverse().join()]
        )
        if (!locationData) throw new NotFoundError('INVALID_LOCATION')
        getTrip.wayPointId = locationData.data.routePathId || getTrip.wayPointId
      }

      const updatTrip = await getTrip.save()
      return requestHandler.sendSuccess(req, res, 'UPDATE_TRIP')({ message: 'UPDATED|TRIP', trip: updatTrip })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Delete Trip
  static deleteTrip = async (req, res) => {
    try {
      const body = req.body
      const getUser = await User.findOne({ _id: req.auth.userId })
      if (!getUser) throw new BadRequestError('NOT_FOUND|USER')

      const tripId = req.params.tripId || body.tripId
      if (!tripId) throw new BadRequestError('PERMISSION_DENIED')

      const queryData = {
        _id: mongoose.Types.ObjectId(tripId),
        status: { $in: [Enum.TRIP.STATUS.PENDING, Enum.TRIP.STATUS.PUBLISHED] }
      }

      if (req.auth) {
        if (req.auth.role == 'USER') queryData['userId'] = mongoose.Types.ObjectId(req.auth.userId)
        else queryData['userId'] = mongoose.Types.ObjectId(body.userId)
      }

      const trip = await Trip.findOneAndUpdate(queryData, { deletedAt: new Date() }, { new: true })
      await NotifcationController.createNotification({
        processType: [Enum.NOTIFICATION.TYPE.MAIL],
        data: {
          subject: 'Trip Deleted',
          email: getUser.email,
          contentdata: {
            postierFirstName: getUser.fname,
            pickupLocation: trip.location.pickUp,
            dropoffLocation: trip.location.drop,
            pickupDateTime: trip.pickupDate,
            tripId: trip.uniCode
          },
          description: 'tripDeleted'
        }
      })

      return requestHandler.sendSuccess(req, res, 'DELETE_TRIP')({ message: 'DELETED|TRIP', trip: trip })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Publish Trip
  static publishTrip = async (req, res) => {
    try {
      const findTrip = await Trip.findOne({ _id: req.params.tripId })
      if (!findTrip) throw new NotFoundError('NOT_FOUND|TRIP')

      findTrip.status = Enum.TRIP.STATUS.PUBLISHED
      const updatedTrip = await findTrip.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'TRIP_PUBLISHED'
      )({ message: 'PUBLISHED|TRIP', data: updatedTrip })
    } catch (error) {
      console.log('Error: publishTrip', error)
      return requestHandler.sendError(req, res, error)
    }
  }

  // Get Estimate
  static getTripEstimation = async (req, res) => {
    try {
      let {
        width,
        height,
        length,
        weight,
        parcelType,
        urgencyLevel,
        distanceCostFactor,
        vehicleId,
        routeId,
        metrics = {}
      } = req.body
      const body = req.body
      const pickupLocation = body.pickupLat + ',' + body.pickupLng
      const dropLocation = body.dropLat + ',' + body.dropLng

      const getRouteData = await RoutePath.findOne({ _id: routeId })
      if (!getRouteData) throw new BadRequestError('NOT_FOUND|ROUTE')

      const getVehicle = await Vehicle.aggregate([
        {
          $match: {
            ownerId: mongoose.Types.ObjectId(req.auth.userId),
            _id: mongoose.Types.ObjectId(vehicleId)
          }
        },
        {
          $lookup: {
            from: 'servicetypes',
            localField: 'servicetype',
            foreignField: '_id',
            as: 'servicetype'
          }
        },
        {
          $unwind: {
            path: '$servicetype',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'pricings',
            localField: 'servicetype._id',
            foreignField: 'serviceId',
            as: 'pricing'
          }
        },
        {
          $unwind: {
            path: '$pricing',
            preserveNullAndEmptyArrays: true
          }
        }
      ])

      console.log('getVehicle', getVehicle)

      if (!getVehicle.length) throw new BadRequestError('NOT_FOUND|PRICING')

      metrics = {
        distanceMetric: 'KILOMETER',
        timeMetric: 'MINUTE',
        dimensionalMetric: 'CM'
      }

      if (metrics.dimensionalMetric !== 'CM') {
        // Convert Inches Into Cm multply with 2.54
        width = Number(width) * 2.54
        height = Number(height) * 2.54
        length = Number(length) * 2.54
        weight = Number(weight)
      } else {
        width = Number(width)
        height = Number(height)
        length = Number(length)
        weight = Number(weight)
      }

      // Calculate Volumetric Weight
      const volumetricWeight = (width * height * length) / 5000
      const highestWeight = Math.max(volumetricWeight, weight)

      // Calculate distance via great circle distance (Haversine formula)
      const totalDistance = await MapServices.calculateDistanceBetweenTwoPoints(
        [pickupLocation],
        [dropLocation]
      )

      const unitDistance = totalDistance
      const distanceMetric = Config.app.distanceMetric
      const timeMetric = Config.app.timeMetric
      const unitTime = getRouteData.duration / 60 // coverting seconds to minutes
      const overallWeight = getVehicle.capacity || 0

      if (weight <= overallWeight) throw new BadRequestError('OVER_WEIGHT_NOT_ALLOWED_FOR_THIS_VEHICLE')

      console.log('getVehicle[0].servicetype._id', getVehicle[0].servicetype._id)

      const priceInfo = await this.getPricing({
        width,
        height,
        length,
        unitTime,
        unitDistance,
        weight: highestWeight,
        urgencyLevel,
        parcelType,
        distanceCostFactor,
        pricingId: getVehicle[0].pricing?._id
      })

      if (!priceInfo) throw new Error(priceInfo.message)
      const pricing = priceInfo.data.estimation

      const finalEstimation = {
        initStep: pricing?.initStep,
        step1: pricing?.step1,
        step2: pricing?.step2,
        step3: pricing?.step3,
        step4: pricing?.step4,
        step5: pricing?.step5,
        step6: pricing?.step6,
        distanceCostFactor: Number(distanceCostFactor),
        distanceInKM: Helpers.roundOff(unitDistance),
        distanceDiscountMultiplier: pricing?.distanceDiscountMultiplier,
        urgencyType: pricing?.urgencyType,
        urgencyMultiplier: pricing?.urgencyFareMultiplier,
        parcelType: pricing?.parcelType,
        parcelTypeDiscountMultiplier: pricing?.parcelTypeFareMultiplier,
        weightDiscountMultiplier: pricing?.weightDiscountMultiplier,
        maxDimension: pricing?.maxDimension,
        sizeDiscountMultiplier: pricing?.sizeDiscountMultiplier,
        highestWeight: highestWeight,
        baseFare: pricing?.baseFare,
        finalPrice: pricing?.finalPrice
      }

      return requestHandler.sendSuccess(
        req,
        res,
        'TRIP_ESTIMATION'
      )({
        estimation: finalEstimation,
        location: {
          unitDistance,
          unitTime,
          distanceMetric,
          timeMetric
        }
      })
    } catch (error) {
      console.error('GET_ESTIMATION_ERROR: ', error)
      return requestHandler.sendError(req, res, error)
    }
  }

  static getPricing = async (pricingInput) => {
    let response = {
      status: false,
      message: 'UNPROCESSABLE_ENTITY',
      data: {}
    }
    try {
      const pricingData = await Pricing.findOne({ _id: pricingInput.pricingId })
      if (!pricingData) throw new Error('NOT_FOUND|PRICING')

      const distanceCostFactor = pricingInput?.distanceCostFactor

      // Great circle distance fare
      const greatCircleDistanceKM = pricingInput?.unitDistance // Total distance in KM

      // Great Circle Distance fare discount
      const distanceDiscountMultiplier =
        greatCircleDistanceKM <= 300
          ? 1
          : greatCircleDistanceKM <= 700
          ? 0.9
          : greatCircleDistanceKM <= 1200
          ? 0.8
          : 0.7

      // Urgency type
      const urgencyType = pricingInput?.urgencyLevel || ''

      // Urgency fare multiplier
      const urgencyFareMultiplier = urgencyType == 'express' ? 1.5 : urgencyType == 'sameDay' ? 2 : 1

      // Parcel type
      const parcelType = pricingInput?.parcelType || ''

      // Parcel type fare discount
      const parcelTypeFareMultiplier =
        parcelType == 'fragile'
          ? 1.2
          : parcelType == 'oversized'
          ? 1.3
          : parcelType == 'temparatureSensitive'
          ? 1.5
          : 1

      // Weight fare discount multiplier
      const weightDiscountMultiplier =
        pricingInput?.weight >= 11 && pricingInput?.weight <= 30
          ? 0.95
          : pricingInput?.weight >= 31 && pricingInput?.weight <= 70
          ? 0.9
          : pricingInput?.weight > 70
          ? 0.85
          : 1

      // Size discount multiplier
      const maxDimension = Math.max(pricingInput?.width, pricingInput?.height, pricingInput?.length)

      const sizeDiscountMultiplier =
        maxDimension >= 100 && maxDimension <= 150 ? 0.95 : maxDimension > 150 ? 0.9 : 1

      // Step 1: Use the highest weight
      const highestWeight = pricingInput?.weight
      console.log('Highest Weight:', highestWeight)

      // Step 2: Calculate distance cost
      const distanceCost = Helpers.roundOff(greatCircleDistanceKM * distanceCostFactor)
      console.log('Distance Cost:', distanceCost)

      // Step 3: Apply distance discount
      const discountDistance = Helpers.roundOff(distanceCost * distanceDiscountMultiplier)
      console.log('Discounted Distance Cost:', discountDistance)

      // Step 4: Apply Base Fare
      const baseFare = discountDistance + pricingData?.baseFare
      console.log('Base Fare:', baseFare)

      // Step 5: Apply Urgency Multiplier
      const urgencyMultiplier = Helpers.roundOff(baseFare * urgencyFareMultiplier)
      console.log('Urgency Multiplier:', urgencyMultiplier)

      // Step 6: Apply Delivery Type Multiplier
      const deliveryTypeMultiplier = Helpers.roundOff(urgencyMultiplier * parcelTypeFareMultiplier)
      console.log('Delivery Type Multiplier:', deliveryTypeMultiplier)

      // Step 7: Apply weight discount
      const weightDiscount = Helpers.roundOff(deliveryTypeMultiplier * weightDiscountMultiplier)
      console.log('Weight Discount:', weightDiscount)

      // Step 8: Apply size discount
      const sizeDiscount = Helpers.roundOff(weightDiscount * sizeDiscountMultiplier)
      console.log('Size Discount:', sizeDiscount)

      // Final price
      const totalFare = sizeDiscount
      console.log('Total Fare:', totalFare)

      const estimation = {
        initStep: distanceCost,
        step1: discountDistance,
        step2: baseFare,
        step3: urgencyMultiplier,
        step4: deliveryTypeMultiplier,
        step5: weightDiscount,
        step6: sizeDiscount,
        distanceCostFactor: Number(distanceCostFactor),
        greatCircleDistanceKM: Helpers.roundOff(greatCircleDistanceKM),
        distanceDiscountMultiplier: distanceDiscountMultiplier,
        urgencyType: urgencyType,
        urgencyFareMultiplier: urgencyFareMultiplier,
        parcelType: parcelType,
        parcelTypeFareMultiplier: parcelTypeFareMultiplier,
        weightDiscountMultiplier: weightDiscountMultiplier,
        maxDimension: maxDimension,
        sizeDiscountMultiplier: sizeDiscountMultiplier,
        highestWeight: highestWeight,
        baseFare: pricingData?.baseFare,
        finalPrice: totalFare
      }
      console.log('Trip Estimation:', estimation)

      response = {
        status: true,
        message: 'ESTIMATED',
        data: {
          estimation,
          pricingInput,
          pricingData
        }
      }
    } catch (error) {
      console.error('GET_PRICING_ERROR: ', error)
      response = {
        status: false,
        message: error.message,
        data: {}
      }
    }
    return response
  }

  // Get Posts By TripId
  static getPostByTripID = async (req, res) => {
    try {
      const queryData = req.query
      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      const queryObj = {}
      if (queryData.id) {
        queryObj.tripId = mongoose.Types.ObjectId(queryData.id)
      }
      const postDataCount = await Post.find(queryObj).count()
      const postData = await Post.find(queryObj).skip(skip).limit(perPage)
      if (!postData.length) throw new NotFoundError('NO_POST_FOUND_FOR_THIS_TRIPID')

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_POST_BY_TRIPID'
      )({
        message: 'GET_POST_BY_TRIPID',
        post: postData,
        total: postDataCount
      })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Get Review
  static getTripReviews = async (req, res) => {
    try {
      const paramData = req.params
      const trip = await Trip.findOne({ _id: paramData.tripId })
      if (!trip) {
        throw new NotFoundError('NOT_FOUND|TRIPS')
      }

      const tripReviews = await Review.find({ reviewee: trip.userId })
        .limit(10)
        .sort({ _id: -1 })
        .populate({ select: 'fname lname profile', path: 'reviewed' })

      const returnData = {
        trip,
        tripReviews,
        message: 'LISTED|TRIP_REVIEWS'
      }

      return requestHandler.sendSuccess(req, res, 'TRIPS_REVIEWS_LISTED')(returnData)
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Get Routes
  static getRoutesForTrip = async (req, res) => {
    try {
      const { pickupLat, pickupLng, dropLat, dropLng } = req.query
      const getWaypoints = await MapServices.getLocationData(
        [`${pickupLat},${pickupLng}`],
        [`${dropLat},${dropLng}`]
      )

      if (!getWaypoints.status) throw new BadRequestError(getWaypoints.message)

      const routePathData = await RoutePath.find({ _id: { $in: getWaypoints.data.routePathIds } })

      if (routePathData.length < 0) throw new BadRequestError('INVALID|PATH')

      const returnData = {
        distanceData: getWaypoints.data,
        routePathData: routePathData,
        message: 'LISTED|ROUTES'
      }

      return requestHandler.sendSuccess(req, res, 'GET_ROUTE_DATA')(returnData)
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Get single Routes
  static getSingleRoute = async (req, res) => {
    try {
      const { routeId } = req.params

      const routePathData = await RoutePath.findOne(
        { _id: mongoose.Types.ObjectId(routeId) },
        { route: 1, overviewPolyline: 1 }
      )
      if (!routePathData) throw new BadRequestError('NOT_FOUND|ROUTE')

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_ROUTE_DATA'
      )({ message: 'LISTED|ROUTE', routePathData })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Homepage
  static searchForTrips = async (req, res) => {
    try {
      const queryData = req.query
      const perPage = parseInt(queryData.limit) || 10
      const page = parseInt(queryData.page) || 1
      const skip = perPage * page - perPage || 0
      const matchQuery = { deletedAt: null }
      let onLogin
      const sortOptions = {
        'Earliest departure': { pickupDate: 1 },
        'Lowest price': { avgPrice: 1 },
        'Close to start point': { distance: 1 },
        'Shortest ride': { deliveryDate: 1 }
      }
      const sortBy = sortOptions[queryData.sortBy] || { _id: -1 }
      matchQuery['pickupDate'] = {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }

      if (!queryData.pickupLng || !queryData.pickupLat || !queryData.dropLng || !queryData.dropLat) {
        throw new BadRequestError('Missing required location fields.')
      }

      const startCoords = [parseFloat(queryData.pickupLng), parseFloat(queryData.pickupLat)]
      const endCoords = [parseFloat(queryData.dropLng), parseFloat(queryData.dropLat)]
      // const maxDistanceInRadians = 20 / 6378.1

      const queryVector = await MapServices.getVector(startCoords, endCoords)

      const createRouteCorridor = async () => {
        const bufferDistance = 20
        const line = turf.lineString([
          [parseFloat(queryData.pickupLng), parseFloat(queryData.pickupLat)],
          [parseFloat(queryData.dropLng), parseFloat(queryData.dropLat)]
        ])
        return turf.buffer(line, bufferDistance, { units: 'kilometers' })
      }
      const data = await createRouteCorridor()
      console.log(JSON.stringify(data))

      // const searchInRoutePaths = await RoutePath.aggregate([
      //   {
      //     $match: {
      //       $and: [
      //         {
      //           'route.coordinates': {
      //             $geoWithin: { $centerSphere: [startCoords, maxDistanceInRadians] }
      //           }
      //         },
      //         {
      //           'route.coordinates': {
      //             $geoWithin: { $centerSphere: [endCoords, maxDistanceInRadians] }
      //           }
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     $match: {
      //       $expr: {
      //         $gt: [
      //           {
      //             $add: [
      //               { $multiply: [queryVector.data.x, '$vector.x'] },
      //               { $multiply: [queryVector.data.y, '$vector.y'] }
      //             ]
      //           },
      //           0.1
      //         ]
      //       }
      //     }
      //   },
      //   {
      //     $project: {
      //       _id: 1
      //     }
      //   }
      // ])
      const searchInRoutePaths = await RoutePath.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: startCoords },
            maxDistance: 20000,
            distanceField: 'distance',
            spherical: true
          }
        },
        {
          $match: {
            'route.coordinates': {
              $geoIntersects: {
                $geometry: data?.geometry
              }
            }
          }
        },
        {
          $match: {
            $expr: {
              $gt: [
                {
                  $add: [
                    { $multiply: [queryVector.data.x, '$vector.x'] },
                    { $multiply: [queryVector.data.y, '$vector.y'] }
                  ]
                },
                0.1
              ]
            }
          }
        },
        {
          $project: {
            _id: 1
          }
        }
      ])

      const filteredIds = await Promise.all(searchInRoutePaths.map((data) => data._id))

      if (filteredIds.length > 0) {
        matchQuery['wayPointId'] = { $in: filteredIds }
      }

      const findDistance = `
      function(startCoords, endCoords) {
        if (!startCoords) return null
        if (!endCoords) return null

        const [longitude1, latitude1] = startCoords
        const [longitude2, latitude2] = endCoords

        const lat1 = parseFloat(latitude1)
        const lat2 = parseFloat(latitude2)

        const long1 = parseFloat(longitude1)
        const long2 = parseFloat(longitude2)

        const toRad = (value) => (value * Math.PI) / 180
        const earthRadius = 6371

        const dlat = toRad(lat2 - lat1)
        const dlong = toRad(long2 - long1)
        const a =
          Math.sin(dlat / 2) * Math.sin(dlat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dlong / 2) * Math.sin(dlong / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = earthRadius * c
        const distanceInMeters = distance * 1000;
        return distanceInMeters
      }
       `

      if (queryData.userId) {
        onLogin = [
          {
            $lookup: {
              from: 'requests',
              let: {
                tripId: '$_id'
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $or: [
                        { $eq: ['$transmitterId', mongoose.Types.ObjectId(queryData.userId)] },
                        { $eq: ['$bidding.1.userId', mongoose.Types.ObjectId(queryData.userId)] }
                      ]
                    }
                  }
                }
              ],
              as: 'requestData'
            }
          },
          {
            $match: {
              requestData: []
            }
          }
        ]
      }

      if (queryData.pickupDate) {
        const inputDate = new Date(queryData.pickupDate)
        const startOfDay = new Date(inputDate.setUTCHours(0, 0, 0, 0))
        const endOfDay = new Date(inputDate.setUTCHours(23, 59, 59, 999))
        matchQuery.pickupDate = {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }

      if (queryData.deliveryDate) {
        const inputDate = new Date(queryData.deliveryDate)
        const startOfDay = new Date(inputDate.setUTCHours(0, 0, 0, 0))
        const endOfDay = new Date(inputDate.setUTCHours(23, 59, 59, 999))
        matchQuery.deliveryDate = {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }

      if (queryData.pickupStart && queryData.pickupEnd) {
        matchQuery['pickupDate'] = {
          $gte: new Date(queryData.pickupStart),
          $lte: new Date(queryData.pickupEnd)
        }
      }

      if (queryData.deliveryStart && queryData.deliveryEnd) {
        matchQuery['deliveryDate'] = {
          $gte: new Date(queryData.deliveryStart),
          $lte: new Date(queryData.deliveryEnd)
        }
      }

      if (queryData.deliveryType) {
        const deliveryTypes = queryData.deliveryType.split(',')
        matchQuery['deliveryType'] = { $in: deliveryTypes }
      }

      if (queryData.vehicleType) {
        const vehicleTypes = queryData.vehicleType.split(',')
        matchQuery['postier.vehicleDetails.vehicleType'] = { $in: vehicleTypes }
      }

      if (queryData.rating) {
        matchQuery['postier.ratings.totalValue'] = {
          $gte: parseFloat(queryData.rating)
        }
      }

      const tripMatchesArr = [
        {
          $geoNear: {
            near: { type: 'Point', coordinates: startCoords },
            key: 'location.startCoords',
            distanceField: 'distance',
            query: {
              wayPointId: { $in: filteredIds }
            },
            spherical: true
          }
        },
        {
          $match: {
            status: { $eq: Enum.TRIP.STATUS.PUBLISHED }
          }
        },
        {
          $addFields: {
            stopPoints: {
              $map: {
                input: '$stopPoints',
                as: 'stopPoint',
                in: {
                  $mergeObjects: [
                    '$$stopPoint',
                    {
                      distanceToPost: {
                        $function: {
                          body: findDistance,
                          args: ['$$stopPoint.coords.coordinates', endCoords],
                          lang: 'js'
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $addFields: {
            updatedFare: {
              $let: {
                vars: {
                  filteredPoints: {
                    $filter: {
                      input: '$stopPoints',
                      as: 'stopPoint',
                      cond: { $lte: ['$$stopPoint.distanceToPost', 20000] }
                    }
                  }
                },
                in: {
                  $cond: {
                    if: { $gt: [{ $size: '$$filteredPoints' }, 0] },
                    then: { $arrayElemAt: ['$$filteredPoints.fare', 0] },
                    else: '$avgPrice'
                  }
                }
              }
            }
          }
        },
        {
          $match: matchQuery
        }
      ]

      const tripMatches = await Trip.aggregate([
        ...tripMatchesArr,
        ...(queryData.userId ? onLogin : ''),
        { $sort: sortBy },
        { $skip: skip },
        { $limit: perPage }
      ])
      const tripMatchesCount = await Trip.aggregate([
        ...tripMatchesArr,
        ...(queryData.userId ? onLogin : ''),
        { $count: 'totalCount' }
      ])

      return requestHandler.sendSuccess(
        req,
        res,
        'TRIPS_LISTED'
      )({ message: 'LISTED|TRIPS', total: tripMatchesCount[0]?.totalCount || 0, trips: tripMatches })
    } catch (error) {
      console.log(error)
      return requestHandler.sendError(req, res, error)
    }
  }

  // Get Detail Trip
  static getDetailTrip = async (req, res) => {
    try {
      const { tripId } = req.params
      const tripData = await Trip.findOne({ _id: tripId }).exec()
      if (!tripData) throw new NotFoundError('NOT_FOUND|TRIP')
      const queryData = req.query
      const endCoords = [parseFloat(queryData.dropLng), parseFloat(queryData.dropLat)]
      const findDistance = `
      function(startCoords, endCoords) {
        if (!startCoords) return null
        if (!endCoords) return null

        const [longitude1, latitude1] = startCoords
        const [longitude2, latitude2] = endCoords

        const lat1 = parseFloat(latitude1)
        const lat2 = parseFloat(latitude2)

        const long1 = parseFloat(longitude1)
        const long2 = parseFloat(longitude2)

        const toRad = (value) => (value * Math.PI) / 180
        const earthRadius = 6371

        const dlat = toRad(lat2 - lat1)
        const dlong = toRad(long2 - long1)
        const a =
          Math.sin(dlat / 2) * Math.sin(dlat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dlong / 2) * Math.sin(dlong / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        const distance = earthRadius * c
        const distanceInMeters = distance * 1000;
        return distanceInMeters
      }
       `
      const tripMatchesArr = [
        {
          $match: {
            _id: mongoose.Types.ObjectId(tripId)
          }
        },
        {
          $addFields: {
            stopPoints: {
              $map: {
                input: '$stopPoints',
                as: 'stopPoint',
                in: {
                  $mergeObjects: [
                    '$$stopPoint',
                    {
                      distanceToPost: {
                        $function: {
                          body: findDistance,
                          args: ['$$stopPoint.coords.coordinates', endCoords],
                          lang: 'js'
                        }
                      }
                    }
                  ]
                }
              }
            }
          }
        },
        {
          $addFields: {
            updatedFare: {
              $let: {
                vars: {
                  filteredPoints: {
                    $filter: {
                      input: '$stopPoints',
                      as: 'stopPoint',
                      cond: { $lte: ['$$stopPoint.distanceToPost', 20000] }
                    }
                  }
                },
                in: {
                  $cond: {
                    if: { $gt: [{ $size: '$$filteredPoints' }, 0] },
                    then: { $arrayElemAt: ['$$filteredPoints.fare', 0] },
                    else: '$avgPrice'
                  }
                }
              }
            }
          }
        }
      ]

      const tripMatches = await Trip.aggregate(tripMatchesArr)
      if (!tripMatches || !tripMatches.length) throw new BadRequestError('NOT_FOUND|TRIP')

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_DETAIL_TRIP'
      )({
        message: 'SUCCESS',
        trip: tripMatches[0]
      })
    } catch (error) {
      console.log(error)
      return requestHandler.sendError(req, res, error)
    }
  }
}

export { TripController }
