/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */

import mongoose from 'mongoose'
import { BaseController } from '../../../controllers/BaseController.js'

import MessageDelivery from '../../Socket/models/MessageDelivery.js'
import Trip from '../../../models/Service/Trip.js'
import Post from '../../../models/Service/Post.js'
import Channels from '../models/Channels.js'
import ChannelUsers from '../models/ChannelUsers.js'
import { SocketValidator } from '../../../validators/Module/SocketValidator.js'
import { RequestHandler } from '../../../utils/RequestHandler.js'
import { Logger } from '../../../utils/Logger.js'
import { BadRequestError, NotFoundError } from '../../../utils/ErrorHandler.js'
import { Enum } from '../../../utils/Enum.js'
const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class ChatController extends BaseController {
  constructor() {
    super()
  }

  static createChannelForBidding = async (data) => {
    try {
      const { userId } = req.auth
      const { tripId, postId, supportId } = req.body

      if (!tripId || !postId) throw new BadRequestError('MISSING_FIELD')
      if (!userId) throw new BadRequestError('USER_ID_REQUIRED')

      const existingChannelQuery = {}
      if (tripId) existingChannelQuery['tripId'] = tripId
      if (postId) existingChannelQuery['postId'] = postId

      let existingChannel = await Channels.findOne(existingChannelQuery).populate({
        path: 'channelUsers',
        match: { userId: mongoose.Types.ObjectId(userId) }
      })

      if (existingChannel) {
        const checkChannelUser = await ChannelUsers.findOne({
          userId: userId,
          channelId: existingChannel._id
        })

        if (checkChannelUser.deletedAt !== null) {
          await ChannelUsers.findOneAndUpdate(
            { channelId: existingChannel._id, userId: userId },
            { deletedAt: null },
            { runValidators: true }
          )
        }
        return requestHandler.sendSuccess(
          req,
          res,
          'CHANNEL_ALREADY_EXISTS'
        )({
          message: 'CHANNEL_ALREADY_EXISTS',
          channel: existingChannel
        })
      }

      const postData = await Post.findById(postId)
      if (!postData) throw new BadRequestError('NOT_FOUND|POST')

      const tripData = await Trip.findById(tripId)
      if (!tripData) throw new BadRequestError('NOT_FOUND|TRIP')

      if (!userId.equals(postData.userId) && !userId.equals(tripData.userId)) {
        throw new BadRequestError('INVALID_USER')
      }
      existingChannel = await new Channels({
        creatorId: userId,
        tripId,
        postId,
        supportId: supportId || null
      }).save()
      await ChannelUsers.insertMany([
        {
          channelId: existingChannel._id,
          userId: postData.userId
        },
        {
          channelId: existingChannel._id,
          userId: tripData.userId
        }
      ])

      return requestHandler.sendSuccess(
        req,
        res,
        'CHANNEL_CREATED'
      )({
        message: 'CREATED|CHANNEL',
        channel: existingChannel
      })
    } catch (error) {
      console.error('Error creating channel:', error)
      return requestHandler.sendError(req, res, error)
    }
  }

  static createChannel = async (req, res) => {
    try {
      const { userId } = req.auth
      const { tripId, postId, supportId } = req.body

      if (!tripId || !postId) throw new BadRequestError('MISSING_FIELD')
      if (!userId) throw new BadRequestError('USER_ID_REQUIRED')

      const existingChannelQuery = {}
      if (tripId) existingChannelQuery['tripId'] = tripId
      if (postId) existingChannelQuery['postId'] = postId

      let existingChannel = await Channels.findOne(existingChannelQuery).populate({
        path: 'channelUsers',
        match: { userId: mongoose.Types.ObjectId(userId) }
      })

      if (existingChannel) {
        const checkChannelUser = await ChannelUsers.findOne({
          userId: userId,
          channelId: existingChannel._id
        })

        if (checkChannelUser.deletedAt !== null) {
          await ChannelUsers.findOneAndUpdate(
            { channelId: existingChannel._id, userId: userId },
            { deletedAt: null },
            { runValidators: true }
          )
        }
        if (req.body.type == 'bidding') return existingChannel

        return requestHandler.sendSuccess(
          req,
          res,
          'CHANNEL_ALREADY_EXISTS'
        )({
          message: 'CHANNEL_ALREADY_EXISTS',
          channel: existingChannel
        })
      }

      const postData = await Post.findById(postId)
      if (!postData) throw new BadRequestError('NOT_FOUND|POST')

      const tripData = await Trip.findById(tripId)
      if (!tripData) throw new BadRequestError('NOT_FOUND|TRIP')

      if (!userId.equals(postData.userId) && !userId.equals(tripData.userId)) {
        throw new BadRequestError('INVALID|USER')
      }
      existingChannel = await new Channels({
        creatorId: userId,
        tripId,
        postId,
        supportId: supportId || null
      }).save()
      await ChannelUsers.insertMany([
        {
          channelId: existingChannel._id,
          userId: postData.userId
        },
        {
          channelId: existingChannel._id,
          userId: tripData.userId
        }
      ])

      return requestHandler.sendSuccess(
        req,
        res,
        'CHANNEL_CREATED'
      )({
        message: 'CREATED|CHANNEL',
        channel: existingChannel
      })
    } catch (error) {
      console.error('Error creating channel:', error)
      return requestHandler.sendError(req, res, error)
    }
  }

  static getChannel = async (req, res) => {
    try {
      const queryData = req.query
      const validation = await SocketValidator.getChannel(queryData)
      if (!validation.status) return requestHandler.sendError(req, res, validation.data)

      const perPage = Number(queryData.limit) || 10
      const page = Number(queryData.page) || 1
      const skip = (page - 1) * perPage

      const auth = req.auth
      const userId = auth.role == Enum.ROLES.USER ? auth.userId : queryData.userId
      if (!userId) throw new BadRequestError('INVALID_REQUEST')
      let channelQueryArr = [
        {
          $lookup: {
            from: 'channelusers',
            let: {
              channelId: '$_id'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$channelId', '$$channelId'] },
                      { $eq: ['$userId', userId] },
                      { $eq: ['$deletedAt', null] }
                    ]
                  }
                }
              }
            ],
            as: 'channelUsers'
          }
        },
        {
          $unwind: {
            path: '$channelUsers'
          }
        },
        {
          $lookup: {
            from: 'messagedeliveries',
            let: {
              channelId: '$_id'
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$channelId', '$$channelId'] },
                      { $eq: ['$deletedAt', null] },
                      { $eq: ['$receiverId', userId] }
                    ]
                  }
                }
              },
              {
                $sort: { _id: -1 }
              },
              {
                $limit: 1
              },
              {
                $lookup: {
                  from: 'messages',
                  localField: 'messageId',
                  foreignField: '_id',
                  as: 'message'
                }
              }
            ],
            as: 'messages'
          }
        },
        {
          $match: {
            $or: [
              {
                $expr: {
                  $and: [{ $eq: ['$creatorId', userId] }]
                }
              },
              {
                $expr: {
                  $and: [{ $ne: ['$creatorId', userId] }, { $ne: ['$messages', []] }]
                }
              }
            ]
          }
        },
        {
          $project: {
            creatorId: 1,
            tripId: 1,
            postId: 1,
            supportId: 1,
            deletedAt: 1,
            messages: 1,
            unseen: '$channelUsers.unseen'
          }
        }
      ]

      if (req.params.channelId) {
        channelQueryArr = [
          {
            $match: { _id: mongoose.Types.ObjectId(req.params.channelId) }
          },
          ...channelQueryArr
        ]
      }

      const sortQuery = {}
      if (queryData.channelId) {
        channelQueryArr.push({
          $addFields: {
            prioritize: { $eq: ['$_id', mongoose.Types.ObjectId(queryData.channelId)] }
          }
        })
        sortQuery['prioritize'] = -1
      }
      sortQuery['_id'] = -1
      const channelsPipeline = [
        ...channelQueryArr,
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [
              { $sort: { ...sortQuery } },
              { $skip: skip || 0 },
              { $limit: perPage || 10 },
              { $project: { prioritize: 0 } },
              {
                $lookup: {
                  from: 'channelusers',
                  let: {
                    channelId: '$_id'
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [{ $eq: ['$channelId', '$$channelId'] }, { $ne: ['$userId', userId] }]
                        }
                      }
                    },
                    {
                      $lookup: {
                        from: 'users',
                        let: {
                          userId: '$userId'
                        },
                        pipeline: [
                          {
                            $match: {
                              $expr: {
                                $and: [{ $eq: ['$_id', '$$userId'] }]
                              }
                            }
                          },
                          {
                            $project: {
                              fname: 1,
                              lname: 1,
                              profile: 1,
                              ratings: 1
                            }
                          }
                        ],
                        as: 'userInfo'
                      }
                    },
                    {
                      $unwind: {
                        path: '$userInfo',
                        preserveNullAndEmptyArrays: true
                      }
                    },
                    {
                      $project: {
                        fname: '$userInfo.fname',
                        lname: '$userInfo.lname',
                        profile: '$userInfo.profile',
                        ratings: '$userInfo.ratings',
                        lastSeen: 1,
                        status: 1
                      }
                    }
                  ],
                  as: 'receiverData'
                }
              },
              {
                $lookup: {
                  from: 'trips',
                  let: {
                    tripId: '$tripId'
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [{ $eq: ['$_id', '$$tripId'] }]
                        }
                      }
                    },
                    {
                      $project: {
                        title: 1,
                        location: 1,
                        fname: '$postier.fname',
                        lname: '$postier.lname',
                        profile: '$postier.profile',
                        ratings: '$postier.ratings',
                        pickupDate: '$pickupDate',
                        deliveryDate: '$deliveryDate',
                        userId: 1
                      }
                    }
                  ],
                  as: 'tripInfo'
                }
              },
              {
                $lookup: {
                  from: 'posts',
                  let: {
                    postId: '$postId'
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [{ $eq: ['$_id', '$$postId'] }]
                        }
                      }
                    },
                    {
                      $project: {
                        fname: '$user.fname',
                        lname: '$user.lname',
                        profile: '$user.profile',
                        ratings: '$user.ratings',
                        title: '$parcel.title',
                        pickupDate: '$parcel.pickupDate',
                        deliveryDate: '$parcel.deliveryDate',
                        location: 1,
                        userId: 1
                      }
                    }
                  ],
                  as: 'postInfo'
                }
              }
              // {
              //   $project: {
              //     creatorId: 1,
              //     tripId: 1,
              //     postId: 1,
              //     supportId: 1,
              //     messages: 1
              //     // receiverData:
              //   }
              // }
            ]
          }
        }
      ]

      const channels = await Channels.aggregate(channelsPipeline)
      if (!channels.length) throw new NotFoundError('NOT_FOUND|CHANNEL')

      return requestHandler.sendSuccess(
        req,
        res,
        'CHANNELS_LISTED'
      )({
        message: 'LISTED|CHANNEL',
        channels: channels[0]?.data || [],
        total: channels[0]?.metadata[0]?.total || 0
      })
    } catch (error) {
      console.log(error)
      return requestHandler.sendError(req, res, error)
    }
  }

  static getMessages = async (req, res) => {
    try {
      const queryData = req.query
      const channelId = req.params.channelId
      const perPage = Number(queryData.limit) || 10
      const page = Number(queryData.page) || 1
      const skip = (page - 1) * perPage

      const userId = mongoose.Types.ObjectId(req.auth.userId)
      const messages = await MessageDelivery.aggregate([
        {
          $match: {
            receiverId: userId,
            channelId: mongoose.Types.ObjectId(channelId)
          }
        },
        {
          $lookup: {
            from: 'messages',
            localField: 'messageId',
            foreignField: '_id',
            as: 'messageInfo'
          }
        },
        {
          $unwind: {
            path: '$messageInfo',
            preserveNullAndEmptyArrays: true
          }
        },
        { $sort: { _id: -1 } },
        { $skip: skip },
        { $limit: perPage },
        { $sort: { _id: 1 } }
      ])

      return requestHandler.sendSuccess(req, res, 'MESSAGE_LISTED')({ message: 'LISTED|MESSAGE', messages })
    } catch (error) {
      console.log(error)
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteMessages = async (req, res) => {
    try {
      const channelId = req.params.channelId
      const userId = mongoose.Types.ObjectId(req.auth.userId)
      const { messageIds } = req.query
      if (!messageIds) throw new BadRequestError('REQUIRED|MESSAGEID')

      const messageIdsArray = messageIds.split(',')
      const currentDate = new Date()

      const messageData = await MessageDelivery.updateMany(
        {
          channelId: mongoose.Types.ObjectId(channelId),
          receiverId: userId,
          messageId: { $in: messageIdsArray },
          deletedAt: null
        },
        { $set: { deletedAt: currentDate } }
      )
      if (!messageData) throw new BadRequestError('FAILED|MESSAGE DELETION')

      return requestHandler.sendSuccess(req, res, 'MESSAGE_DELETED')({ message: 'DELETED|MESSAGE' })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateMessages = async (req, res) => {
    try {
      const { receiverId } = req.query
      const currentDate = new Date()
      const userId = req.auth?.userId

      const updatedData = await MessageDelivery.updateMany(
        {
          senderId: mongoose.Types.ObjectId(receiverId),
          receiverId: userId
        },
        { $set: { seenAt: currentDate } }
      )
      if (!updatedData) throw new BadRequestError('FAILED|MESSAGE UPDATE')

      return requestHandler.sendSuccess(req, res, 'MESSAGE_UPDATED')({ message: 'UPDATED|MESSAGE' })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteChannels = async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.auth.userId)
      const { channelIds } = req.query
      if (!channelIds) throw new BadRequestError('REQUIRED|CHANNELID')

      const currentDate = new Date()
      const channelIdArray = channelIds.split(',').map(mongoose.Types.ObjectId)

      const userChannelData = await ChannelUsers.updateMany(
        { channelId: { $in: channelIdArray }, userId: userId, deletedAt: null },
        { deletedAt: currentDate },
        { new: true }
      )
      if (!userChannelData) throw new BadRequestError('INVALID|CHANNELUSER')
      else {
        await MessageDelivery.updateMany(
          { channelId: { $in: channelIdArray }, receiverId: { $eq: userId } },
          { $set: { deletedAt: currentDate } }
        )
      }

      return requestHandler.sendSuccess(req, res, 'CHANNEL_DELETED')({ message: 'DELETED|CHANNELS' })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }
}

export { ChatController }
