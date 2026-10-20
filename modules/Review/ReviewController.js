/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { AuthServices } from '../../services/Common/AuthService.js'
import ReviewRating from './Review.js'
import { RequestHandler } from '../../utils/RequestHandler.js'
import Post from '../../models/Service/Post.js'
import Trip from '../../models/Service/Trip.js'
import { Enum } from '../../utils/Enum.js'
import { Logger } from '../../utils/Logger.js'
import { BadRequestError } from '../../utils/ErrorHandler.js'

const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class ReviewController {
  constructor() {}

  static addRating = async (req, res) => {
    try {
      const { rating, module, comment, moduleId } = req.body
      const userId = req.auth.userId
      let moduleData

      if (module === 'Trip') {
        moduleData = await Trip.findOne({ _id: moduleId })
        if (!moduleData) throw new BadRequestError('NOT_FOUND|TRIP')
      } else if (module === 'Post') {
        moduleData = await Post.findOne({ _id: moduleId })
        if (!moduleData) throw new BadRequestError('NOT_FOUND|POST')
      } else {
        throw new BadRequestError('INVALID_MODULE|TYPE')
      }

      const isAlreadyRated = await ReviewRating.findOne({
        reviewed: userId,
        reviewee: moduleData.userId,
        moduleId: moduleData._id
      })

      if (isAlreadyRated) throw new BadRequestError('ALREADY_FOUND|RATING')

      const createRating = await ReviewRating.create({
        reviewed: req.auth.userId,
        reviewee: moduleData.userId,
        module,
        moduleId: moduleData._id,
        rating: Number(rating),
        comments: comment
      })

      const ratingData = {
        userId: moduleData.userId,
        rating
      }

      await AuthServices.updateRating(ratingData)

      return requestHandler.sendSuccess(
        req,
        res,
        'REVIEW_RATING_ADDED'
      )({
        review: createRating,
        message: 'ADDED|REVIEW_AND_RATING'
      })
    } catch (error) {
      console.log('error', error)
      return requestHandler.sendError(req, res, error)
    }
  }

  static getRating = async (req, res) => {
    try {
      let { page, limit, options, moduleType, moduleId, userId } = req.query
      limit = Number(limit) || 10
      page = Number(page) || 1
      const skip = limit * page - limit
      userId = userId || req.auth.userId
      const findQuery = {}

      // if (options) {
      //   if (req.auth.role !== Enum.ROLES.ADMIN && userId) {
      //     if (options === 'received') {
      //       findQuery.reviewee = userId
      //     } else {
      //       findQuery.reviewed = userId
      //     }
      //   }
      // }

      if (options && req.auth.role !== Enum.ROLES.ADMIN && userId) {
        findQuery[options === 'received' ? 'reviewee' : 'reviewed'] = userId
      }

      if (moduleType) {
        findQuery.module = moduleType
      }

      if (moduleId) {
        findQuery.moduleId = moduleId
      }

      const rating = await ReviewRating.find(findQuery)
        .skip(skip)
        .limit(limit)
        .sort({ _id: -1 })
        .populate([
          { path: 'reviewee', select: 'fname lname profile uniCode' },
          { path: 'reviewed', select: 'fname lname profile uniCode' },
          { path: 'moduleId', select: moduleType == 'Post' ? 'referenceNo' : 'uniCode' }
        ])
      const ratingCount = await ReviewRating.countDocuments(findQuery)

      const returnData = {
        rating,
        total: ratingCount,
        message: 'LISTED|RATING'
      }

      return requestHandler.sendSuccess(req, res, 'RATING_LISTED')(returnData)
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }
}

export { ReviewController }
