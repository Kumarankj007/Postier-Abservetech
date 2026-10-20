/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'
import { BaseController } from '../BaseController.js'

import { RequestHandler } from '../../utils/RequestHandler.js'
import { Logger } from '../../utils/Logger.js'
import User from '../../models/Auth/User.js'
import Post from '../../models/Service/Post.js'
import Trip from '../../models/Service/Trip.js'
import Review from '../../modules/Review/Review.js'
import { PaymentServices } from '../../modules/Payment/PaymentService.js'

import { PostValidator } from '../../validators/Service/PostValidator.js'

import { BadRequestError, NotFoundError, UnprocessableError } from '../../utils/ErrorHandler.js'
import { MapServices } from '../../modules/Map/index.js'
import { Enum } from '../../utils/Enum.js'
import { TripController } from './TripController.js'
import { NotifcationController } from '../Notification/Index.js'
import RoutePath from '../../modules/Map/RoutePath.js'
import fs from 'fs'
import path from 'path'
import { CreteriaService } from '../../services/Creteria/CreteriaServices.js'
import { Config } from '../../config/AppConfig.js'
import { Helpers } from '../../helpers/Function.js'
const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class PostController extends BaseController {
  constructor() {
    super()
  }
  static getPost = async (req, res) => {
    try {
      const queryData = req.query
      const paramData = req.params
      const sortOrder = queryData.sortOrder?.toLowerCase() === 'asc' ? 1 : -1
      const perPage = Number(queryData.limit) || 10
      const page = Number(queryData.page) || 1
      const skip = (page - 1) * perPage

      const validator = await PostValidator.getPost(queryData, paramData)
      if (!validator.status) throw new UnprocessableError('Validation Failed', validator.data.validate)

      const postierFind = []
      const findQuery = { deletedAt: null }
      const matchStage = {
        $match: findQuery
      }

      if (queryData.startLng && queryData.startLat && queryData.endLng && queryData.endLat) {
        const startCoords = [parseFloat(queryData.startLng), parseFloat(queryData.startLat)]
        const endCoords = [parseFloat(queryData.endLng), parseFloat(queryData.endLat)]
        const maxDistanceInRadians = 20000 / 6378137

        // const results = await RoutePath.aggregate([
        //   {
        //     $addFields: {
        //       startCoord: { $arrayElemAt: ['$route.coordinates', 0] },
        //       endCoord: { $arrayElemAt: ['$route.coordinates', -1] }
        //     }
        //   },
        //   {
        //     $match: {
        //       startCoord: {
        //         $geoWithin: { $centerSphere: [startCoords, maxDistanceInRadians] }
        //       },
        //       endCoord: {
        //         $geoWithin: { $centerSphere: [endCoords, maxDistanceInRadians] }
        //       }
        //     }
        //   },
        //   {
        //     $addFields: {
        //       startToEndVector: {
        //         x: { $subtract: [endCoords[0], startCoords[0]] },
        //         y: { $subtract: [endCoords[1], startCoords[1]] }
        //       },
        //       routeVector: {
        //         x: {
        //           $subtract: [
        //             { $arrayElemAt: ['$route.coordinates', -1] },
        //             { $arrayElemAt: ['$route.coordinates', 0] }
        //           ]
        //         },
        //         y: {
        //           $subtract: [
        //             { $arrayElemAt: ['$route.coordinates', -1] },
        //             { $arrayElemAt: ['$route.coordinates', 0] }
        //           ]
        //         }
        //       }
        //     }
        //   },
        //   {
        //     $match: {
        //       $expr: {
        //         $gt: [
        //           {
        //             $add: [
        //               { $multiply: ['$startToEndVector.x', '$routeVector.x'] },
        //               { $multiply: ['$startToEndVector.y', '$routeVector.y'] }
        //             ]
        //           },
        //           0
        //         ]
        //       }
        //     }
        //   }
        // ])

        const queryVector = await MapServices.getVector(startCoords, endCoords)
        if (!queryVector.status) throw new BadRequestError(queryVector.message)

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

        findQuery['wayPointId'] = { $in: waypointsArr }
      }

      if (queryData.search) {
        const searchRegex = { $regex: queryData.search, $options: 'i' }
        findQuery.$or = [
          { 'user.fname': searchRegex },
          { 'user.lname': searchRegex },
          { 'user.email': searchRegex },
          { 'user.phone': searchRegex }
        ]
      }

      if (queryData.pickupDate) {
        const startDate = new Date(queryData.pickupDate)
        const dayStart = startDate.setHours(0, 0, 0, 0)
        const dayEnd = startDate.setHours(23, 59, 59, 999)
        findQuery['parcel.pickupDate'] = { $gte: new Date(dayStart), $lte: new Date(dayEnd) }
      }

      if (queryData.deliveryDate) {
        const endDate = new Date(queryData.deliveryDate)
        const dayStart = endDate.setHours(0, 0, 0, 0)
        const dayEnd = endDate.setHours(23, 59, 59, 999)
        findQuery['parcel.deliveryDate'] = { $gte: new Date(dayStart), $lte: new Date(dayEnd) }
      }

      if (req.auth) {
        const userId = req.auth.role == Enum.ROLES.USER ? req.auth.userId : queryData.userId
        if (userId) {
          findQuery.userId = mongoose.Types.ObjectId(userId)
        }
      }

      if (paramData.postId) {
        findQuery['_id'] = mongoose.Types.ObjectId(paramData.postId)
      }

      if (
        [
          Enum.TRIP.STATUS.PENDING,
          Enum.TRIP.STATUS.PUBLISHED,
          Enum.TRIP.STATUS.TRANSIT,
          Enum.TRIP.STATUS.DELIVERED,
          Enum.TRIP.STATUS.CANCELLED
        ].includes(queryData.status)
      ) {
        findQuery['status'] = queryData.status
      }

      const countPipeline = [...postierFind, matchStage, { $count: 'totalCount' }]
      const countResult = await Post.aggregate(countPipeline)
      const getDataCount = countResult[0]?.totalCount || 0

      postierFind.push(matchStage, { $sort: { _id: sortOrder } }, { $skip: skip }, { $limit: perPage })

      if (paramData.postId) {
        const singlePostier = await Post.aggregate(postierFind)

        return requestHandler.sendSuccess(
          req,
          res,
          'GET_POST'
        )({
          message: 'SUCCESS',
          post: singlePostier[0]
        })
      }

      const postiers = await Post.aggregate(postierFind)

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_POST'
      )({
        message: 'SUCCESS',
        posts: postiers,
        total: getDataCount
      })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Create Post
  static createPost = async (req, res) => {
    let post
    try {
      const body = req.body

      body.isScheduleLater = body.isScheduleLater ? body.isScheduleLater : 'false'
      const validation = await PostValidator.createPost(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const userId =
        req.auth.role === Enum.ROLES.USER ? req.auth.userId : mongoose.Types.ObjectId(body.userId)
      const getUser = await User.findOne({ _id: userId })
      if (!getUser) throw new Error('NOT_FOUND|USER')

      const newPost = new Post({
        userId: getUser._id,
        status: body.status ? body.status : Enum.TRIP.STATUS.PUBLISHED,
        consignor: {
          userId: getUser._id,
          firstName: getUser.fname,
          lastName: getUser.lname,
          email: getUser.email,
          phoneCode: getUser.phoneCode,
          phone: getUser.phone,
          city: getUser.city || body.city,
          country: getUser.country || body.country,
          pinCode: getUser.pinCode || body.pincode,
          state: getUser.state || body.state,
          address: body.address,
          profile: getUser.profile,
          status: getUser.status,
          ratings: getUser.ratings
        },
        location: {
          pickUp: body.pickupAddress,
          pickUpCity: body.pickUpCity,
          pickUpPlaceId: body.pickUpPlaceId,
          drop: body.dropAddress,
          dropCity: body.dropCity,
          dropPlaceId: body.dropPlaceId,
          startCoords: {
            coordinates: [parseFloat(body.pickupLng), parseFloat(body.pickupLat)]
          },
          endCoords: {
            coordinates: [parseFloat(body.dropLng), parseFloat(body.dropLat)]
          }
        },
        parcel: {
          type: body.type,
          heightType: body.heightType,
          height: Number(body.height),
          weight: Number(body.weight),
          desc: body.desc,
          widthType: body.widthType,
          width: Number(body.width),
          lengthType: body.lengthType,
          length: Number(body.length),
          dimensionType: 'Centi-Meter',
          fare: body.fare,
          deliveryType: body.deliveryType,
          pickupDate: new Date(body.pickupDate),
          deliveryDate: new Date(body.deliveryDate),
          isPrivateImage: body.isPrivateImage
        },
        scheduleLater: {
          status: body.isScheduleLater,
          time: body.scheduleTime ? new Date(body.scheduleTime) : null
        }
      })
      const locationData = await MapServices.getLocationData(
        [`${body.pickupLat},${body.pickupLng}`],
        [`${body.dropLat},${body.dropLng}`]
      )

      newPost.wayPointId = locationData.data.routePathId
      post = await newPost.save()
      if (req.files) {
        const files = req.files
        const parcelFolder = `./public/temp/auth/Parcel/${post._id}`

        if (!fs.existsSync(parcelFolder)) {
          await CreteriaService.makeDirectory(parcelFolder)
        }

        // Define the new paths for the images
        const primaryImage = files.primaryImage
          ? path.join(parcelFolder, files.primaryImage[0].filename)
          : null
        const topviewImage = files.topviewImage
          ? path.join(parcelFolder, files.topviewImage[0].filename)
          : null
        const frontviewImage = files.frontviewImage
          ? path.join(parcelFolder, files.frontviewImage[0].filename)
          : null
        const sideviewImage = files.sideviewImage
          ? path.join(parcelFolder, files.sideviewImage[0].filename)
          : null

        // Move files to the new folder
        if (primaryImage) await CreteriaService.moveFile(files.primaryImage[0].path, primaryImage)
        if (topviewImage) await CreteriaService.moveFile(files.topviewImage[0].path, topviewImage)
        if (frontviewImage) await CreteriaService.moveFile(files.frontviewImage[0].path, frontviewImage)
        if (sideviewImage) await CreteriaService.moveFile(files.sideviewImage[0].path, sideviewImage)
        post.parcel.image = {
          primaryImage: primaryImage || null,
          topviewImage: topviewImage || null,
          frontviewImage: frontviewImage || null,
          sideviewImage: sideviewImage || null
        }
        post = await post.save()
      }
      await NotifcationController.createNotification({
        processType: [Enum.NOTIFICATION.TYPE.MAIL],
        data: {
          subject: 'Your Parcel Creation is Confirmed - Postier',
          email: getUser.email,
          contentdata: {
            name: `${getUser.fname} ${getUser.lname}`,
            description: body.desc,
            pickupLoc: body.pickupAddress,
            dropLoc: body.dropAddress,
            pickupDate: new Date(body.pickupDate).toISOString().split('T')[0],
            dropDate: new Date(body.deliveryDate).toISOString().split('T')[0],
            price: body.fare
          },
          description: 'parcelCreated'
        }
      })

      return requestHandler.sendSuccess(req, res, 'CREATE_POST')({ message: 'CREATED|POST', post: post })
    } catch (error) {
      console.log('err', error)

      if (post) {
        await Post.findOneAndDelete({ _id: post._id })
      }
      return requestHandler.sendError(req, res, error)
    }
  }

  // Update Post
  static updatePost = async (req, res) => {
    try {
      const body = req.body
      const postId = req.params.postId || req.body.postId

      const validation = await PostValidator.updatePost(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const post = await Post.findById(postId).exec()
      if (!post) throw new BadRequestError('NOT_FOUND|POST')

      post.consignor.userId = body.userId || post.consignor.userId
      post.consignor.firstName = body.firstName || post.consignor.firstName
      post.consignor.lastName = body.lastName || post.consignor.lastName
      post.consignor.email = body.email || post.consignor.email
      post.consignor.phoneCode = body.phoneCode || post.consignor.phoneCode
      post.consignor.phone = body.phone || post.consignor.phone
      post.consignor.address = body.address || post.consignor.address
      post.consignor.city = body.city || post.consignor.city
      post.consignor.state = body.state || post.consignor.state
      post.consignor.country = body.country || post.consignor.country
      post.consignor.pinCode = body.pinCode || post.consignor.pinCode

      post.location.pickUp = body.pickupAddress || post.location.pickUp
      post.location.drop = body.dropAddress || post.location.drop
      post.location.pickUpCity = body.pickUpCity || post.location.pickUpCity
      post.location.dropCity = body.dropCity || post.location.dropCity
      post.location.pickUpPlaceId = body.pickUpPlaceId || post.location.pickUpPlaceId
      post.location.dropPlaceId = body.dropPlaceId || post.location.dropPlaceId
      let startCoords = null
      if (body.pickupLat && body.pickupLng)
        startCoords = [parseFloat(body.pickupLng), parseFloat(body.pickupLat)]

      let endCoords = null
      if (body.dropLat && body.dropLng) endCoords = [parseFloat(body.dropLng), parseFloat(body.dropLat)]

      if (startCoords || endCoords) {
        post.location.startCoords.coordinates = startCoords || post.location.startCoords.coordinates
        post.location.endCoords.coordinates = endCoords || post.location.endCoords.coordinates

        const locationData = await MapServices.getLocationData(
          [post.location.startCoords.coordinates.reverse().join()],
          [post.location.endCoords.coordinates.reverse().join()]
        )
        if (!locationData) throw new NotFoundError('INVALID_LOCATION')
        post.wayPointId = locationData.data.routePathId || post.wayPointId
      }

      post.parcel.pickupDate = new Date(body.pickupDate) || post.parcel.pickupDate
      post.parcel.deliveryDate = new Date(body.deliveryDate) || post.parcel.deliveryDate
      post.parcel.deliveryType = body.deliveryType || post.parcel.deliveryType
      post.parcel.description = body.description || post.parcel.description
      post.parcel.type = body.type || post.parcel.type
      post.parcel.height = Number(body.height) || post.parcel.height
      post.parcel.heightType = body.heightType || post.parcel.heightType
      post.parcel.width = Number(body.width) || post.parcel.width
      post.parcel.widthType = body.widthType || post.parcel.widthType
      post.parcel.length = Number(body.length) || post.parcel.length
      post.parcel.dimensionType = body.dimensionType || post.parcel.dimensionType
      post.parcel.lengthType = body.lengthType || post.parcel.lengthType
      post.parcel.size = body.size || post.parcel.size

      post.consignee.firstName = body.consigneeFirstName || post.consignee.firstName
      post.consignee.lastName = body.consigneeLastName || post.consignee.lastName
      post.consignee.email = body.consigneeEmail || post.consignee.email
      post.consignee.phoneCode = body.consigneePhoneCode || post.consignee.phoneCode
      post.consignee.phone = body.consigneePhone || post.consignee.phone
      post.consignee.address = body.consigneeAddress || post.consignee.address
      post.consignee.city = body.consigneeCity || post.consignee.city
      post.consignee.state = body.consigneeState || post.consignee.state
      post.consignee.country = body.consigneeCountry || post.consignee.country
      post.consignee.pinCode = body.consigneePinCode || post.consignee.pinCode

      // Handle image upload with selective deletion of old files
      if (req.files?.length > 0) {
        const parcelFolder = `./public/temp/auth/Parcel/${post._id}`
        const images = {
          primaryImage: req.files.primaryImage
            ? req.files.primaryImage[0].path
            : post.parcel?.image[0].primaryImage,
          topviewImage: req.files.topviewImage
            ? req.files.topviewImage[0].path
            : post.parcel?.image[0].topviewImage,
          frontviewImage: req.files.frontviewImage
            ? req.files.frontviewImage[0].path
            : post.parcel?.image[0].frontviewImage,
          sideviewImage: req.files.sideviewImage
            ? req.files.sideviewImage[0].path
            : post.parcel?.image[0].sideviewImage
        }
        console.log('IMAGES', images)

        for (const [key, newImagePath] of Object.entries(images)) {
          if (newImagePath) {
            const oldImagePath = post.parcel.image ? post.parcel.image[key] : null

            // Remove old image if it exists
            if (oldImagePath) {
              await CreteriaService.removeFile(oldImagePath)
            }

            // Move new image to parcel folder and update path
            const newImageFullPath = path.join(parcelFolder, path.basename(newImagePath))
            await CreteriaService.moveFile(newImagePath, newImageFullPath)
            post.parcel.image[key] = newImageFullPath
          }
        }
      }

      const updatedPost = await post.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_POST'
      )({ message: 'UPDATED|POST', post: updatedPost })
    } catch (error) {
      console.log(error)

      return requestHandler.sendError(req, res, error)
    }
  }

  // Delete Post
  static deletePost = async (req, res) => {
    try {
      const body = req.body
      const getUser = await User.findOne({ _id: req.auth.userId })
      if (!getUser) throw new BadRequestError('NOT_FOUND|USER')

      let postId = null
      postId = req.params.postId || body.postId

      if (!postId) throw new BadRequestError('PERMISSION_DENIED')

      const post = await Post.findOneAndUpdate({ _id: postId }, { deletedAt: new Date() }, { new: true })
      await NotifcationController.createNotification({
        processType: [Enum.NOTIFICATION.TYPE.MAIL],
        data: {
          subject: 'Parcel Deleted',
          email: getUser.email,
          contentdata: 'Your parcel has been successfully deleted!',
          description: 'parcelDeleted'
        }
      })

      return requestHandler.sendSuccess(req, res, 'DELETE_POST')({ message: 'DELETED|POST', post: post })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Publish Post
  static postPublish = async (req, res) => {
    try {
      const params = req.params
      const post = await Post.findById(params.postId).exec()
      if (!post) throw new NotFoundError('No_DATA_FOUND')
      post.status = Enum.TRIP.STATUS.PUBLISHED
      const updatePost = await post.save()
      if (updatePost.suggestionId) {
        const findTrip = await Trip.findOne({ _id: post.suggestionId })
        if (!findTrip) throw new BadRequestError('NOT_FOUND|TRIP')

        const originCoordinates = [
          `${post.location.startCoords.coordinates[1]},${post.location.startCoords.coordinates[0]}`
        ]
        const destinationCoordinates = [
          `${findTrip.location.startCoords.coordinates[1]},${findTrip.location.startCoords.coordinates[0]}`
        ]
        const getDistance = await MapServices.calculateDistanceBetweenTwoPoints(
          originCoordinates,
          destinationCoordinates
        )
        const manipulatedBody = {
          userId: post.userId,
          postId: post._id,
          tripId: post.suggestionId,
          distance: Number(getDistance) * 1000
        }

        req.body = {
          ...req.body,
          ...manipulatedBody
        }
        await TripController.createRequest(req, res)
        return
      }
      return requestHandler.sendSuccess(
        req,
        res,
        'POST_PUBLISHED'
      )({ message: 'PUBLISHED|POST', post: updatePost })
    } catch (error) {
      console.log('error', error)

      return requestHandler.sendError(req, res, error)
    }
  }

  // Get Estimate
  static getPostEstimation = async (req, res) => {
    try {
      let {
        width,
        height,
        length,
        weight,
        urgencyLevel,
        parcelType,
        distanceCostFactor,
        metrics = {}
      } = req.body
      const body = req.body
      const pickupLocation = body.pickupLat + ',' + body.pickupLng
      const dropLocation = body.dropLat + ',' + body.dropLng

      metrics = {
        distanceMetric: body.metric.distanceMetric,
        timeMetric: body.metric.timeMetric,
        dimensionalMetric: body.metric.dimensionalMetric
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
      const finalWeight = Math.max(volumetricWeight, weight)
      const weightKg = finalWeight / 1000
      const highestWeight = Math.ceil(weightKg)

      // Calculate distance via great circle distance (Haversine formula)
      const totalDistance = await MapServices.calculateDistanceBetweenTwoPoints(
        [pickupLocation],
        [dropLocation]
      )

      const travelInfo = await MapServices.getLocationData([pickupLocation], [dropLocation], metrics)
      if (!travelInfo || !travelInfo?.status) throw new Error('DISTANCE_ESTIMATION_FAILED')

      const unitDistance = totalDistance // travelInfo.data.distanceValue
      const distanceMetric = travelInfo.data.distanceMetric || Config.app.distanceMetric
      const timeMetric = travelInfo.data.timeMetric || Config.app.timeMetric
      const unitTime = travelInfo.data.timeValue

      const priceInfo = await this.getPricing({
        width,
        height,
        length,
        unitTime,
        unitDistance,
        weight: highestWeight,
        urgencyLevel,
        parcelType,
        baseFare: Config.app.baseFare,
        distanceCostFactor
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
        'GET_ESTIMATION'
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
      console.error('GET_ESTIMATION_ERROR post: ', error)
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
      const baseFare = discountDistance + pricingInput?.baseFare
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
        baseFare: pricingInput?.baseFare,
        finalPrice: totalFare
      }
      console.log('Post Estimation:', estimation)

      response = {
        status: true,
        message: 'ESTIMATED',
        data: {
          estimation,
          pricingInput
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

  // Make Payment
  static makePayment = async (req, res) => {
    try {
      const bodyData = req.body

      const makePayment = {
        tripId: bodyData.tripId,
        postId: bodyData.postId,
        paymentMethodId: bodyData.paymentMethodId,
        paymentMethod: bodyData.paymentMethod
      }

      const checkPayment = await PaymentServices.initializePayment(makePayment)

      if (checkPayment.status) {
        if (checkPayment.data.paymentStatus) {
          const returnData = {
            postData: checkPayment.data.postData,
            tripData: checkPayment.data.tripData,
            paymentStatus: checkPayment.data.paymentStatus
          }

          await NotifcationController.createNotification({
            processType: [Enum.NOTIFICATION.TYPE.MAIL],
            data: {
              subject: 'Payment Successful',
              email: checkPayment.data?.postData.consignor.email,
              contentdata: {
                firstname: checkPayment.data?.postData.consignor.firstName,
                orderId: checkPayment.data?.postData._id,
                paymentDate: new Date().toISOString().split('T')[0],
                totalAmount: checkPayment.data?.postData.parcel.fare,
                paymentMethod: 'card',
                senderName: checkPayment.data?.postData.consignor.firstName,
                receiverName: checkPayment.data?.postData.consignee.firstName,
                pickupLocation: checkPayment.data?.postData.location.pickUp,
                dropLocation: checkPayment.data?.postData.location.drop,
                trackingId: checkPayment.data?.tripData._id,
                estimatedDeliveryDate: new Date(checkPayment.data?.postData.parcel.deliveryDate)
              },
              description: 'paymentSuccess'
            }
          })
          return requestHandler.sendSuccess(req, res, 'PAYMENT_INTIATED')(returnData)
        }
      }
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Get Review
  static getPostReviews = async (req, res) => {
    try {
      const paramData = req.params
      const post = await Post.findOne({ _id: paramData.postId })
      if (!post) {
        throw new NotFoundError('NOT_FOUND|POST')
      }

      const postReviews = await Review.find({ reviewee: post.userId })
        .limit(10)
        .sort({ _id: -1 })
        .populate({ select: 'fname lname profile', path: 'reviewed' })

      const returnData = {
        post,
        postReviews,
        message: 'LISTED|POST_REVIEWS'
      }

      return requestHandler.sendSuccess(req, res, 'POST_REVIEWS_LISTED')(returnData)
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Homepage
  static searchForPosts = async (req, res) => {
    try {
      const queryData = req.query
      const perPage = parseInt(queryData.limit) || 10
      const page = parseInt(queryData.page) || 1
      const skip = perPage * page - perPage || 0
      const matchQuery = { status: Enum.TRIP.STATUS.PUBLISHED, deletedAt: null  }
      let onLogin
      const sortOptions = {
        'Earliest departure': { 'parcel.pickupDate': 1 },
        'Lowest price': { 'parcel.fare': 1 },
        'Close to start point': { distance: 1 },
        'Shortest ride': { 'parcel.deliveryDate': 1 }
      }
      const sortBy = sortOptions[queryData.sortBy] || { _id: -1 }
      matchQuery['parcel.pickupDate'] = {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }

      if (!queryData.pickupLng || !queryData.pickupLat || !queryData.dropLng || !queryData.dropLat) {
        throw new BadRequestError('Missing required location fields.')
      }

      const startCoords = [parseFloat(queryData.pickupLng), parseFloat(queryData.pickupLat)]
      const endCoords = [parseFloat(queryData.dropLng), parseFloat(queryData.dropLat)]
      const maxDistanceInRadians = 20 / 6378.1

      const queryVector = await MapServices.getVector(startCoords, endCoords)

      const searchInRoutePaths = await RoutePath.aggregate([
        {
          $match: {
            $and: [
              {
                'route.coordinates': {
                  $geoWithin: { $centerSphere: [startCoords, maxDistanceInRadians] }
                }
              }
              /*               {
                'route.coordinates': {
                  $geoWithin: { $centerSphere: [endCoords, maxDistanceInRadians] }
                }
              } */
            ]
          }
        },
        {
          $unionWith: {
            coll: 'routePaths',
            pipeline: [
              {
                $match: {
                  'route.coordinates': {
                    $geoWithin: { $centerSphere: [endCoords, maxDistanceInRadians] }
                  }
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

      const radius = (queryData.radius ? parseFloat(queryData.radius) : 20) * 1000
      if (queryData.userId) {
        onLogin = [
          {
            $lookup: {
              from: 'requests',
              let: {
                postId: '$_id'
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
        matchQuery['parcel.pickupDate'] = {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }

      if (queryData.minHeight || queryData.maxHeight) {
        const heightFilter = []

        if (queryData.minHeight)
          heightFilter.push({ 'parcel.height': { $gte: parseFloat(queryData.minHeight) * 2.54 } })
        if (queryData.maxHeight)
          heightFilter.push({ 'parcel.height': { $lte: parseFloat(queryData.maxHeight) * 2.54 } })
        if (heightFilter.length > 0) matchQuery['$and'] = heightFilter
      }

      if (queryData.minWeight || queryData.maxWeight) {
        const weightFilter = []

        if (queryData.minWeight)
          weightFilter.push({ 'parcel.weight': { $gte: parseFloat(queryData.minWeight) } })
        if (queryData.maxWeight)
          weightFilter.push({ 'parcel.weight': { $lte: parseFloat(queryData.maxWeight) } })
        if (weightFilter.length > 0) matchQuery['$and'] = weightFilter
      }

      if (queryData.parcelType) {
        const parcelTypesArray = queryData.parcelType.split(',')
        matchQuery['$expr'] = {
          $gt: [{ $size: { $setIntersection: [parcelTypesArray, { $split: ['$parcel.type', ','] }] } }, 0]
        }
      }

      if (queryData.deliveryType) {
        const deliveryTypes = queryData.deliveryType.split(',')
        matchQuery['parcel.deliveryType'] = { $in: deliveryTypes }
      }

      if (queryData.rating) {
        matchQuery['consignor.ratings.totalValue'] = {
          $gte: parseFloat(queryData.rating)
        }
      }

      const postMatchesArr = [
        {
          $geoNear: {
            near: { type: 'Point', coordinates: startCoords },
            key: 'location.startCoords',
            maxDistance: radius,
            distanceField: 'distance',
            query: {
              wayPointId: { $in: filteredIds }
            },
            spherical: true
          }
        },
        {
          $match: matchQuery
        }
      ]
      const postMatches = await Post.aggregate([
        ...postMatchesArr,
        ...(queryData.userId ? onLogin : ''),
        { $sort: sortBy },
        { $skip: skip },
        { $limit: perPage }
      ])
      const postMatchesCount = await Post.aggregate([
        ...postMatchesArr,
        ...(queryData.userId ? onLogin : ''),
        { $count: 'totalCount' }
      ])

      return requestHandler.sendSuccess(
        req,
        res,
        'POSTS_LISTED'
      )({ message: 'LISTED|POSTS', total: postMatchesCount[0]?.totalCount || 0, posts: postMatches })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Get Detail Post
  static getDetailPost = async (req, res) => {
    try {
      const { postId } = req.params

      const postData = await Post.findOne({ _id: mongoose.Types.ObjectId(postId) })
        .populate({ path: 'tripId', select: 'location postier status' })
        .lean()
      if (!postData) throw new BadRequestError('NOT_FOUND|POST')

      return requestHandler.sendSuccess(req, res, 'GET_DETAIL_POST')({ message: 'SUCCESS', post: postData })
    } catch (error) {
      console.log(error)
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateSenderReceiver = async (req, res) => {
    const body = req.body
    const postId = req.params.postId || req.body.postId

    const post = await Post.findById(postId).exec()
    if (!post) throw new NotFoundError('NOT_FOUND|POST')

    // Sender
    post.consignor.userId = body.userId || post.consignor.userId
    post.consignor.firstName = body.firstName || post.consignor.firstName
    post.consignor.lastName = body.lastName || post.consignor.lastName
    post.consignor.email = body.email || post.consignor.email
    post.consignor.phoneCode = body.phoneCode || post.consignor.phoneCode
    post.consignor.phone = body.phone || post.consignor.phone
    post.consignor.address = body.address || post.consignor.address
    post.consignor.city = body.city || post.consignor.city
    post.consignor.state = body.state || post.consignor.state
    post.consignor.country = body.country || post.consignor.country
    post.consignor.pinCode = body.pinCode || post.consignor.pinCode

    // Receiver
    post.consignee.firstName = body.consigneeFirstName || post.consignee.firstName
    post.consignee.lastName = body.consigneeLastName || post.consignee.lastName
    post.consignee.email = body.consigneeEmail || post.consignee.email
    post.consignee.phoneCode = body.consigneePhoneCode || post.consignee.phoneCode
    post.consignee.phone = body.consigneePhone || post.consignee.phone
    post.consignee.address = body.consigneeAddress || post.consignee.address
    post.consignee.city = body.consigneeCity || post.consignee.city
    post.consignee.state = body.consigneeState || post.consignee.state
    post.consignee.country = body.consigneeCountry || post.consignee.country
    post.consignee.pinCode = body.consigneePinCode || post.consignee.pinCode
    const updatedPost = await post.save()

    return requestHandler.sendSuccess(
      req,
      res,
      'SENDER & RECEIVER UPDATED'
    )({ message: 'SUCCESS', post: updatedPost })
  }

  static updateParcel = async (req, res) => {
    const body = req.body
    const postId = req.params.postId || req.body.postId
    const validation = await PostValidator.updatePost(body)
    if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

    const post = await Post.findById(postId).exec()
    if (!post) throw new NotFoundError('NO_DATA_FOUND')
    post.parcel.title = body.title || post.parcel.title
    post.parcel.description = body.description || post.parcel.description
    post.parcel.type = body.type || post.parcel.type
    post.parcel.height = body.height || post.parcel.height
    post.parcel.width = body.width || post.parcel.width
    post.parcel.size = body.size || post.parcel.size
    post.parcel.apprxSize = body.apprxSize || post.parcel.apprxSize
    post.parcel.heightType = body.heightType || post.parcel.heightType
    post.parcel.widthType = body.widthType || post.parcel.widthType

    let arr = []

    if (req.files && req.files.files && !body.oldFile) {
      for (const data of req.files.files) {
        arr.push(data.path)
      }
      post.parcel.image = arr
    } else if ((!req.files || (req.files && Object.keys(req.files).length === 0)) && body.oldFile) {
      arr = body.oldFile.split(',')
      post.parcel.image = arr
    } else if (req.files && req.files.files && body.oldFile) {
      arr = body.oldFile.split(',')
      for (const data of req.files.files) {
        arr.push(data.path)
      }
      post.parcel.image = arr
    } else {
      console.log('No files uploaded and no old file provided')
    }

    return post
  }

  static postRouteSuggestion = async (req, res) => {
    try {
      const userId = req.query.userId || req.auth.userId
      if (!userId) throw new BadRequestError('NOT_FOUND|USER')

      const userSuggestion = await Post.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
            'location.pickUp': {
              $ne: ''
            },
            'location.drop': {
              $ne: ''
            }
          }
        },
        {
          $group: {
            _id: {
              pickUp: '$location.pickUp',
              pickUpCity: '$location.pickUpCity',
              pickUpPlaceId: '$location.pickUpPlaceId',
              drop: '$location.drop',
              dropCity: '$location.dropCity',
              dropPlaceId: '$location.dropPlaceId',
              startCoords: '$location.startCoords.coordinates',
              endCoords: '$location.endCoords.coordinates'
            },
            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            count: -1
          }
        },
        {
          $limit: 5
        }
      ])

      return requestHandler.sendSuccess(
        req,
        res,
        'LISTED_FREQUENTLY_USED_ROUTE'
      )({ message: 'LISTED|FREQUENTLY_USED_ROUTES', suggestion: userSuggestion })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }
}
export { PostController }
