/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'
import { BaseController } from '../BaseController.js'

import Trip from '../../models/Service/Trip.js'
import Post from '../../models/Service/Post.js'
import Request from '../../models/Service/Request.js'
import User from '../../models/Auth/User.js'
import RoutePath from '../../modules/Map/RoutePath.js'
import Message from '../../modules/Socket/models/Messages.js'
import MessageDelivery from '../../modules/Socket/models/MessageDelivery.js'
import ChannelUsers from '../../modules/Socket/models/ChannelUsers.js'
import { ChatController } from '../../modules/Socket/controllers/ChatController.js'
import { NotifcationController } from '../Notification/Index.js'
import { PaymentServices } from '../../modules/Payment/PaymentService.js'
import { RequestHandler } from '../../utils/RequestHandler.js'
import { Helpers as Helper, Helpers } from '../../helpers/Function.js'
import { Enum } from '../../utils/Enum.js'
import { Logger } from '../../utils/Logger.js'
import { BadRequestError, NotFoundError } from '../../utils/ErrorHandler.js'
import Pricing from '../../models/Creteria/Pricing.js'
import { MapServices } from '../../modules/Map/index.js'
import { Config } from '../../config/AppConfig.js'

const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class RequestController extends BaseController {
  constructor() {
    super()
  }
  // Create Request
  static createRequest = async (req, res) => {
    try {
      const { body, auth, params } = req
      const userId = auth?.userId || body.userId
      const { tripId, postId } = params
      if (!tripId || !postId) throw new BadRequestError('MISSING|FIELDS')

      const trip = await Trip.findById(tripId).populate({
        path: 'userId',
        select: 'fcmId fname lname profile'
      })
      if (!trip) throw new NotFoundError('NOT_FOUND|TRIP')

      const post = await Post.findById(postId).populate({
        path: 'userId',
        select: 'fcmId fname lname profile'
      })
      if (!post) throw new NotFoundError('NOT_FOUND|POST')

      if (post.parcel.weight > trip.maxWeight) throw new BadRequestError('Weight limit exceeded')

      if (body.type == 'bidding') {
        const chatChannel = await ChatController.createChannel(req, res)
        if (!chatChannel) throw new BadRequestError('NOT_CREATED|CHANNEL')

        const channelData = await Helper.verifyChannelUser({ channelId: chatChannel._id, userId })
        if (!channelData) throw new BadRequestError('NOT_ALLOWED')

        const message = {
          userId: userId,
          userType: Enum.ROLES.USER,
          channelId: chatChannel._id,
          type: body.type,
          content: body.amount
        }
        const newMessage = await Messages.create(message)
        if (!newMessage) throw new BadRequestError('MESSAGE_NOT_STORED')

        const messageInfo = []
        // Have to collect opposite user and send notification promtly
        if (channelData.channelUsers) {
          for (const channelUsers of channelData.channelUsers) {
            const newDelivery = await MessageDelivery.create({
              messageId: newMessage._id,
              senderId: userId,
              channelId: chatChannel._id,
              receiverId: channelUsers.userId,
              seenAt: channelUsers.userId.equals(userId) ? nowDate : null
            })

            if (!channelUsers.userId.equals(userId)) {
              // Increase unseen count by 1 for the recipient
              await ChannelUsers.findOneAndUpdate(
                { channelId: chatChannel._id, userId: channelUsers.userId },
                { $inc: { unseen: 1 } },
                { runValidators: true }
              )
              // Notification
              sendNotification({
                content,
                title: 'Message',
                userId: channelUsers.userId,
                userRole: Enum.ROLES.USER
              })

              const MessageData = {
                ...newDelivery._doc,
                messageInfo: newMessage
              }
              messageInfo.push(MessageData)
            }
          }
        }
      }

      const checkExist = await Request.findOne({
        tripId: trip._id,
        postId: post._id,
        transmitterId: userId
      }).exec()
      if (checkExist) throw new BadRequestError('EXISTS|REQUEST')

      const newRequest = new Request({
        tripId: tripId,
        postId: postId,
        transmitterId: userId,
        fare: Number(body.amount) || post.parcel.fare,
        bidding: [
          {
            userId: userId,
            amount: Number(body.amount) || post.parcel.fare
          }
        ]
      })
      const createdRequest = await newRequest.save()

      const usrId = createdRequest.transmitterId === post.userId ? trip.userId : post.userId
      const user = await User.findById(usrId)

      const journey = createdRequest.transmitterId === post.userId ? 'Trip No' : 'Parcel No'
      const tripNo = createdRequest.transmitterId === post.userId ? trip.uniCode : post.referenceNo
      const receiverId = createdRequest.transmitterId === post.userId ? trip.userId : post.userId
      const receiverImage = user?.profile
      const pushToken =
        createdRequest.transmitterId === post.userId._id ? trip.userId.fcmId : post.userId.fcmId

      await NotifcationController.createNotification({
        processType: [Enum.NOTIFICATION.TYPE.PUSHNOTIFICATION, Enum.NOTIFICATION.TYPE.INACCOUNT],
        data: {
          pushToken: pushToken,
          title: 'Message',
          body: `${user.fname} ${user.lname} has send you a request for your ${journey}: ${tripNo}`,
          userType: Enum.ROLES.USER,
          userId: receiverId,
          image: receiverImage || ''
        }
      })

      return requestHandler.sendSuccess(
        req,
        res,
        'REQUEST_SENT'
      )({
        message: 'REQUEST|SENT',
        request: newRequest
      })
    } catch (error) {
      console.error('SEND_REQUEST_ERROR', error)
      return requestHandler.sendError(req, res, error)
    }
  }

  // Update Request
  static updateRequest = async (req, res) => {
    try {
      const { postId, tripId } = req.params
      const isExist = await Request.findOne({
        tripId: tripId,
        postId: postId
      }).exec()
      if (!isExist) {
        this.createRequest(req, res)
        return
      }
      const { status, amount } = req.body

      if (!status) throw new BadRequestError('MISSING_STATUS')

      const trip = await Trip.findById(tripId).populate({
        path: 'userId',
        select: 'fcmId fname lname profile'
      })
      if (!trip) throw new NotFoundError('NOT_FOUND|TRIP')

      const post = await Post.findById(postId).populate({
        path: 'userId',
        select: 'fcmId fname lname profile'
      })
      if (!post) throw new NotFoundError('NOT_FOUND|POST')

      if (post.status !== Enum.TRIP.STATUS.PUBLISHED) throw new NotFoundError('NOT_FOUND|REQUEST')

      const findRequest = await Request.findOne(
        { postId: post._id, tripId: trip._id },
        {
          // Project the last element of the bidding array
          _id: 1,
          lastBid: { $arrayElemAt: ['$bidding', -1] }
        }
      ).lean()

      if (!findRequest) throw new NotFoundError('NOT_FOUND|REQUEST')
      if (findRequest.lastBid?.status != Enum.TRIP.STATUS.REQUESTED) {
        throw new NotFoundError('ALREADY_RESPONDED')
      }

      const isPostier = req.auth.userId.equals(trip.userId)

      const returnData = {}
      if (status === Enum.TRIP.STATUS.ACCEPTED) {
        const pickupCode = await Helper.sendRandomizeCode(4)
        const invoiceNo = await Helper.generateInvoiceNo()

        // trip capacity
        const updatedCapacity = trip.availableCapacity - post.parcel.weight
        await Trip.updateOne({ _id: trip._id }, { $set: { availableCapacity: updatedCapacity } })

        if (!isPostier) {
          returnData['post'] = await Post.findOneAndUpdate(
            { _id: post._id },
            {
              $set: {
                'parcel.fare': findRequest.fare,
                status: Enum.TRIP.STATUS.ACCEPTED,
                tripId: trip._id,
                pickUpCode: pickupCode,
                invoiceNo: invoiceNo
              }
            },
            { new: true, runValidators: true }
          )
        }

        await Post.updateOne(
          { _id: post._id, status: Enum.TRIP.STATUS.REQUESTED },
          {
            $set: {
              status: Enum.TRIP.STATUS.ACCEPTED,
              tripId: trip._id,
              pickUpCode: pickupCode,
              invoiceNo: invoiceNo
            }
          }
        )

        const request = await Request.findOneAndUpdate(
          { _id: findRequest._id, 'bidding.status': Enum.TRIP.STATUS.REQUESTED },
          {
            $set: {
              status: Enum.TRIP.STATUS.ACCEPTED,
              'bidding.$.status': Enum.TRIP.STATUS.ACCEPTED
            }
          },
          { new: true, runValidators: true }
        )
        const lastMessage = await Message.findOne({ context: findRequest._id }).sort({ _id: -1 })
        if (lastMessage) {
          await Message.updateMany({ context: findRequest._id }, [
            {
              $set: {
                status: {
                  $cond: [
                    { $eq: ['$_id', lastMessage._id] },
                    Enum.TRIP.STATUS.ACCEPTED,
                    Enum.TRIP.STATUS.BIDDED
                  ]
                }
              }
            }
          ])
        }

        const usrId = req.auth.userId.equals(trip.userId) ? post.userId : trip.userId
        const user = await User.findById(usrId)

        const journey = req.auth.userId.equals(post.userId) ? 'Trip No' : 'Parcel No'
        const tripNo = req.auth.userId.equals(post.userId) ? trip.uniCode : post.referenceNo
        const receiverId = req.auth.userId.equals(post.userId) ? trip.userId : post.userId
        const receiverImage = user?.profile
        const pushToken = req.auth.userId.equals(post.userId._id) ? trip.userId.fcmId : post.userId.fcmId
        await NotifcationController.createNotification({
          processType: [
            Enum.NOTIFICATION.TYPE.PUSHNOTIFICATION,
            Enum.NOTIFICATION.TYPE.INACCOUNT,
            Enum.NOTIFICATION.TYPE.MAIL
          ],
          data: {
            subject: 'Request Accepted',
            email: user.email,
            contentdata: {
              PostierFirstname: user.fname,
              PickupLocation: post.location.pickUp,
              DeliveryLocation: post.location.drop,
              ScheduledPickupDate: post.parcel.pickupDate,
              DeliveryType: post.parcel.deliveryType,
              ParcelID: post.referenceNo,
              SenderName: post.consignor.firstName,
              SenderPhone: post.consignor.phone,
              SenderEmail: post.consignor.email
            },
            description: 'requestAccepted',
            pushToken: pushToken,
            title: 'Message',
            body: `${user.fname} ${user.lname} has accepted your ${journey}: ${tripNo}`,
            userType: Enum.ROLES.USER,
            userId: receiverId,
            image: receiverImage || ''
          }
        })

        returnData['status'] = request?.status
        returnData['request'] = request
      } else if (status === Enum.TRIP.STATUS.DECLINED) {
        if (isPostier) {
          await Post.updateOne(
            { _id: post._id },
            {
              $addToSet: { declinedRequests: trip._id }
            }
          )
        } else {
          await Trip.updateOne(
            { _id: trip._id },
            {
              $addToSet: { declinedRequests: post._id }
            }
          )
        }

        const request = await Request.findOneAndUpdate(
          { _id: findRequest._id },
          {
            $set: { 'bidding.$[elem].status': Enum.TRIP.STATUS.DECLINED, status: Enum.TRIP.STATUS.DECLINED }
          },
          { arrayFilters: [{ 'elem.userId': { $ne: req.auth.userId } }], new: true, runValidators: true }
        )

        const lastMessage = await Message.findOne({ context: findRequest._id }).sort({ _id: -1 })
        if (lastMessage) {
          await Message.updateMany({ context: findRequest._id }, [
            {
              $set: {
                status: {
                  $cond: [
                    { $eq: ['$_id', lastMessage._id] },
                    Enum.TRIP.STATUS.DECLINED,
                    Enum.TRIP.STATUS.BIDDED
                  ]
                }
              }
            }
          ])
        }

        const usrId = req.auth.userId.equals(trip.userId) ? post.userId : trip.userId
        const user = await User.findById(usrId)

        const journey = req.auth.userId.equals(post.userId) ? 'Trip No' : 'Parcel No'
        const tripNo = req.auth.userId.equals(post.userId) ? trip.uniCode : post.referenceNo
        const receiverId = req.auth.userId.equals(post.userId) ? trip.userId : post.userId
        const receiverImage = user?.profile
        const pushToken = req.auth.userId.equals(post.userId._id) ? trip.userId.fcmId : post.userId.fcmId
        await NotifcationController.createNotification({
          processType: [Enum.NOTIFICATION.TYPE.PUSHNOTIFICATION, Enum.NOTIFICATION.TYPE.INACCOUNT],
          data: {
            pushToken: pushToken,
            title: 'Message',
            body: `${user.fname} ${user.lname} has declined your ${journey}: ${tripNo}`,
            userType: Enum.ROLES.USER,
            userId: receiverId,
            image: receiverImage || ''
          }
        })

        returnData['status'] = Enum.TRIP.STATUS.DECLINED
        returnData['request'] = request
      } else if (status === Enum.TRIP.STATUS.BIDDED) {
        if (findRequest.lastBid && findRequest.lastBid.userId.toString() === req.auth.userId.toString()) {
          throw new BadRequestError('USER_ALREADY_BIDDED')
        }

        const newBid = { userId: req.auth.userId, amount: Number(amount) }

        // Step 1: Update all existing bids to DECLINED
        await Request.findOneAndUpdate(
          { _id: findRequest._id },
          {
            $set: { 'bidding.$[elem].status': Enum.TRIP.STATUS.DECLINED },
            fare: Number(amount)
          },
          {
            arrayFilters: [{ 'elem.status': { $ne: Enum.TRIP.STATUS.DECLINED } }],
            new: true,
            runValidators: true
          }
        )

        // Step 2: Push the new bid to the bidding array
        const request = await Request.findOneAndUpdate(
          { _id: findRequest._id },
          { $push: { bidding: newBid } },
          { new: true, runValidators: true }
        )

        const usrId = req.auth.userId.equals(trip.userId) ? post.userId : trip.userId
        const user = await User.findById(usrId)

        const journey = req.auth.userId.equals(post.userId) ? 'Trip No' : 'Parcel No'
        const tripNo = req.auth.userId.equals(post.userId) ? trip.uniCode : post.referenceNo
        const receiverId = req.auth.userId.equals(post.userId) ? trip.userId : post.userId
        const receiverImage = user?.profile
        const pushToken = req.auth.userId.equals(post.userId._id) ? trip.userId.fcmId : post.userId.fcmId

        await NotifcationController.createNotification({
          processType: [Enum.NOTIFICATION.TYPE.PUSHNOTIFICATION, Enum.NOTIFICATION.TYPE.INACCOUNT],
          data: {
            pushToken: pushToken,
            title: 'Message',
            body: `${user.fname} ${user.lname} has send you a counter offer price for your ${journey}: ${tripNo}`,
            userType: Enum.ROLES.USER,
            userId: receiverId,
            image: receiverImage || ''
          }
        })

        returnData['status'] = Enum.TRIP.STATUS.DECLINED
        returnData['request'] = request
      } else {
        throw new BadRequestError('INVALID_REQUEST')
      }

      returnData['status'] = status

      return requestHandler.sendSuccess(
        req,
        res,
        'REQUEST_STATUS_UPDATED'
      )({
        message: 'REQUEST_STATUS_UPDATED',
        data: returnData
      })
    } catch (error) {
      console.error('REQUEST_ERROR', error)
      return requestHandler.sendError(req, res, error)
    }
  }

  // Update Tracking
  static updateTrackingStatus = async (req, res) => {
    try {
      const { tripId, postId } = req.params
      const { status, code } = req.body
      if (!status) throw new BadRequestError('MISSING_STATUS')

      const trip = await Trip.findOne({ _id: tripId })
        .populate({
          path: 'userId',
          select: 'fcmId fname lname profile'
        })
        .populate({
          path: 'postier.vehicleDetails._id',
          select: 'servicetype'
        })
      if (!trip) throw new NotFoundError('NOT_FOUND|TRIP')

      const post = await Post.findOne({ _id: postId }).populate({
        path: 'userId',
        select: 'fcmId fname lname profile'
      })
      if (!post) throw new NotFoundError('NOT_FOUND|POST')

      const findRequest = await Request.findOne({
        postId: post._id,
        tripId: trip._id,
        status: Enum.TRIP.STATUS.ACCEPTED
      })
      if (!findRequest) throw new NotFoundError('NOT_FOUND|REQUEST')

      const validStatus = [
        Enum.TRIP.STATUS.PICKEDUP,
        Enum.TRIP.STATUS.TRANSIT,
        Enum.TRIP.STATUS.DELIVERED,
        Enum.TRIP.STATUS.RECEIVED
      ]
      if (!validStatus.includes(status)) throw new BadRequestError('NOT_A_VALID_STATUS')

      if (status == Enum.TRIP.STATUS.PICKEDUP) {
        const findPricing = await Pricing.findOne({
          serviceId: trip?.postier?.vehicleDetails?._id?.servicetype
        })
        if (!findPricing) throw new BadRequestError('NOT_FOUND|PRICING')

        const taxAmt = (findRequest?.fare * findPricing?.taxFare?.fare) / 100
        const postierAmt = (findRequest?.fare - taxAmt - findPricing?.commision) / 100
        const postierPayable = findRequest?.fare - taxAmt - postierAmt

        post.status = status
        post.parcel.fare = findRequest.fare
        post.parcel.tripPayable = postierPayable
        post.parcel.commisonAmount = postierAmt
        post.parcel.taxAmount = taxAmt

        await post.save()

        if (code == post?.pickUpCode) {
          const dropCode = await Helper.sendRandomizeCode(4)
          const consignmentNo = await Helper.generateConsignmentNo()
          post.consignee.deliveryCode = dropCode
          post.consignmentNo = consignmentNo
          post.status = Enum.TRIP.STATUS.TRANSIT
          await post.save()

          const pushToken = trip.userId?.fcmId

          const user = await User.findById(trip.userId)

          await NotifcationController.createNotification({
            processType: [Enum.NOTIFICATION.TYPE.MAIL],
            data: {
              subject: 'Picked Up Successfully',
              email: post.consignor?.email,
              contentdata: {
                senderName: post.consignor?.firstName,
                trackingId: post.referenceNo,
                postierName: `${trip.postier?.fname} ${trip.postier?.lname}`,
                pickupAddress: post.location.pickUp,
                deliveryAddress: post.location.drop,
                pickupDateTime: post.parcel.pickupDate,
                parcelDescription: post.parcel.desc
              },
              description: 'pickupConfirmation'
            }
          })

          await NotifcationController.createNotification({
            processType: [
              Enum.NOTIFICATION.TYPE.PUSHNOTIFICATION,
              Enum.NOTIFICATION.TYPE.INACCOUNT,
              Enum.NOTIFICATION.TYPE.MAIL
            ],
            data: {
              subject: 'Delivery OTP Received',
              email: post.consignee?.email,
              contentdata: { otp: `${dropCode}` },
              description: 'deliveryCode',
              pushToken: pushToken,
              title: 'Message',
              body: `${user.fname} ${user.lname} has picked up your Parcel No: ${post.referenceNo} and is now in transit`,
              userType: Enum.ROLES.USER,
              userId: post.userId,
              image: post.userId?.profile || ''
            }
          })
        } else throw new BadRequestError('INVALID|OTP')
      } else if (status == Enum.TRIP.STATUS.DELIVERED) {
        if (code == post.consignee?.deliveryCode) {
          post.status = Enum.TRIP.STATUS.DELIVERED
          await post.save()
          await NotifcationController.createNotification({
            processType: [Enum.NOTIFICATION.TYPE.MAIL],
            data: {
              subject: 'Delivered Successfully',
              email: post.consignee?.email,
              contentdata: {
                receiverName: post.consignee.firstName,
                senderName: post.consignor.firstName,
                parcelId: post.referenceNo,
                deliveryDate: new Date().toISOString().split('T')[0],
                postierName: trip.postier.fname,
                fromCity: post.location?.pickUpCity,
                toCity: post.location?.dropCity
              },
              description: 'deliveryConfirmation'
            }
          })
          await NotifcationController.createNotification({
            processType: [Enum.NOTIFICATION.TYPE.MAIL],
            data: {
              subject: 'Great job on your delivery!',
              email: trip.postier?.email,
              contentdata: {
                postierName: trip.postier.fname,
                senderName: post.consignor.firstName,
                receiverName: post.consignee.firstName,
                parcelId: post.referenceNo,
                deliveryDate: new Date().toISOString().split('T')[0],
                postierName: trip.postier.fname,
                fromCity: post.location?.pickUpCity,
                toCity: post.location?.dropCity,
                amount: post.parcel.tripPayable
              },
              description: 'deliveryConfirmationPostier'
            }
          })
          await NotifcationController.createNotification({
            processType: [Enum.NOTIFICATION.TYPE.MAIL],
            data: {
              subject: 'Your parcel was delivered! Share your feedback',
              email: trip.postier?.email,
              contentdata: {
                senderName: post.consignor.firstName,
                postierName: trip.postier.fname,
                receiverName: post.consignee.firstName,
                parcelId: post.referenceNo,
                deliveryDate: new Date().toISOString().split('T')[0],
                postierName: trip.postier.fname,
                fromCity: post.location?.pickUpCity,
                toCity: post.location?.dropCity
              },
              description: 'deliveryConfirmationUser'
            }
          })
        } else throw new BadRequestError('INVALID|OTP')
      }

      return requestHandler.sendSuccess(
        req,
        res,
        'STATUS_UPDATED'
      )({ message: 'TRACKING_STATUS|UPDATED', data: post })
    } catch (error) {
      console.error('ACCEPT_DELIVERY_ERROR', error)
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateTripStatus = async (req, res) => {
    try {
      const { tripId } = req.params
      const { status } = req.body

      const findTrip = await Trip.findOne({ _id: tripId })
      if (!findTrip) throw new NotFoundError('NOT_FOUND|TRIP')

      if (
        [
          Enum.TRIP.STATUS.PENDING,
          Enum.TRIP.STATUS.PUBLISHED,
          Enum.TRIP.STATUS.TRANSIT,
          Enum.TRIP.STATUS.FINISHED,
          Enum.TRIP.STATUS.CANCELLED
        ].includes(status)
      ) {
        if (status === Enum.TRIP.STATUS.FINISHED) {
          if (findTrip.status == Enum.TRIP.STATUS.FINISHED) throw new BadRequestError('TRIP_ALREADY_FINISHED')
          const getTotalFare = await Post.aggregate([
            { $match: { tripId: mongoose.Types.ObjectId(tripId), status: Enum.TRIP.STATUS.DELIVERED } },
            {
              $group: {
                _id: null,
                totalFare: { $sum: '$parcel.fare' },
                taxFare: { $sum: '$parcel.taxAmount' },
                commissionAmt: { $sum: '$parcel.commisonAmount' },
                postierAmt: { $sum: '$parcel.tripPayable' }
              }
            }
          ])

          if (!getTotalFare.length) throw new BadRequestError('NOT_FOUND|POST')

          const postierAmt = getTotalFare[0]?.postierAmt

          findTrip.payableAmount = postierAmt
          findTrip.commisonAmount = getTotalFare[0]?.commissionAmt
          findTrip.taxAmount = getTotalFare[0]?.taxFare
          await findTrip.save()

          const transactionData = {
            referenceId: findTrip._id,
            paymentMode: Enum.PAYMENT.MODE.CREDIT,
            userId: findTrip.userId,
            userType: Enum.ROLES.USER,
            amount: Number(postierAmt)
          }
          const transferAmountToPartner = await PaymentServices.merchantTransaction(transactionData)
          if (!transferAmountToPartner.status) {
            throw new Error(transferAmountToPartner.message)
          }
        }

        findTrip.status = status
        const updatedTripData = await findTrip.save()

        const returnData = {
          trip: updatedTripData,
          message: 'UPDATED|TRIP'
        }
        return requestHandler.sendSuccess(req, res, 'UPDATED|STATUS')(returnData)
      } else throw new BadRequestError('INVALID_STATUS')
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Find Nearest Match Postiers
  static findTrips = async (req, res) => {
    try {
      const { postId, tripId } = req.params
      const matchQuery = {}
      const queryData = req.query
      const perPage = Number(queryData.limit) || 10
      const page = Number(queryData.page) || 1
      const skip = page * perPage - perPage || 0
      // const maxDistance = 20000 / 6378137

      const postData = await Post.findOne({ _id: postId }).exec()
      if (!postData) throw new NotFoundError('NOT_FOUND|POST')

      const getCoords = await RoutePath.findOne({ _id: postData.wayPointId })
      if (!getCoords) throw new NotFoundError('NOT_FOUND|ROUTEPATH')

      // Getting Request List
      const getRequests = await Request.distinct('tripId', {
        postId: postData._id
      })

      if (tripId && !getRequests.some((obj) => obj.equals(tripId))) {
        throw new BadRequestError('INVALID|TRIP')
      }

      if (queryData.status == Enum.TRIP.STATUS.ACCEPTED) {
        matchQuery['request.status'] = Enum.TRIP.STATUS.ACCEPTED
      }
      if (queryData.status == Enum.TRIP.STATUS.REQUESTED) {
        matchQuery['request.status'] = Enum.TRIP.STATUS.REQUESTED
      }
      if (queryData.status == Enum.TRIP.STATUS.DECLINED) {
        matchQuery['request.status'] = Enum.TRIP.STATUS.DECLINED
      }
      const pipeline = [
        {
          $match: {
            _id: { $in: tripId ? [mongoose.Types.ObjectId(tripId)] : getRequests }
          }
        },
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
                    $and: [{ $eq: ['$tripId', '$$tripId'] }, { $eq: ['$postId', postData._id] }]
                  }
                }
              }
            ],
            as: 'request'
          }
        },
        { $unwind: '$request' },
        { $match: matchQuery }
      ]
      const tripCount = await Trip.aggregate([...pipeline, { $count: 'totalCount' }])
      const trips = await Trip.aggregate([
        ...pipeline,
        { $sort: { 'request.createdAt': -1 } },
        { $skip: skip },
        { $limit: perPage }
        // {
        //   $facet: {
        //     acceptedRequest: [
        //       { $match: { 'request.status': Enum.TRIP.STATUS.ACCEPTED } },
        //       { $skip: skip },
        //       { $limit: perPage }
        //     ],
        //     allRequest: [
        //       { $match: { 'request.status': { $ne: Enum.TRIP.STATUS.ACCEPTED } } },
        //       { $skip: skip },
        //       { $limit: perPage }
        //     ],
        //     declinedRequest: [
        //       { $match: { 'request.status': Enum.TRIP.STATUS.DECLINED } },
        //       { $skip: skip },
        //       { $limit: perPage }
        //     ]
        //   }
        // }
      ])

      // Near by trips for suggestions
      // const query = [
      //   {
      //     $geoNear: {
      //       near: {
      //         type: 'Point',
      //         coordinates: postData.location.startCoords.coordinates
      //       },
      //       distanceField: 'distance',
      //       // maxDistance: maxDistance,
      //       key: 'location.startCoords',
      //       spherical: true
      //     }
      //   },
      //   {
      //     $lookup: {
      //       from: 'routepaths',
      //       localField: 'wayPointId',
      //       foreignField: '_id',
      //       as: 'routePaths'
      //     }
      //   },
      //   {
      //     $unwind: '$routePaths'
      //   },
      //   {
      //     $match: {
      //       _id: { $nin: getRequests },
      //       status: Enum.TRIP.STATUS.PUBLISHED,
      //       $and: [
      //         {
      //           'routePaths.route.coordinates': {
      //             $geoWithin: {
      //               $centerSphere: [postData.location.startCoords.coordinates, maxDistance]
      //             }
      //           }
      //         },
      //         {
      //           'routePaths.route.coordinates': {
      //             $geoWithin: {
      //               $centerSphere: [postData.location.endCoords.coordinates, maxDistance]
      //             }
      //           }
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     $addFields: {
      //       sortPriority: {
      //         $cond: {
      //           if: { $eq: ['$_id', mongoose.Types.ObjectId(queryData.suggestionId)] },
      //           then: 1,
      //           else: 0
      //         }
      //       }
      //     }
      //   },
      //   {
      //     $sort: {
      //       sortPriority: -1,
      //       _id: -1
      //     }
      //   }
      // ]
      // const suggestionCount = await Trip.aggregate([...query, { $count: 'totalCount' }])
      // const suggestions = await Trip.aggregate([...query, { $skip: skip }, { $limit: perPage }])

      const returnData = {
        // acceptedList: requestList[0]?.acceptedRequest || [],
        // requestList: requestList[0]?.allRequest || [],
        // declinedList: requestList[0]?.declinedRequest || [],
        tripLists: trips,
        total: tripCount[0]?.totalCount || 0,
        // suggestions,
        // total: suggestionCount[0]?.totalCount || 0,
        message: 'NEARBY|TRIPS'
      }
      return requestHandler.sendSuccess(req, res, 'GET_MATCHED_POSTIER')(returnData)
    } catch (error) {
      console.log(error, 'error')
      return requestHandler.sendError(req, res, error)
    }
  }

  // Find Nearest Match Users
  static findPosts = async (req, res) => {
    try {
      const { tripId, postId } = req.params
      const matchQuery = {}
      const queryData = req.query
      const perPage = Number(queryData.limit) || 10
      const page = Number(queryData.page) || 1
      const skip = perPage * page - perPage || 0

      const tripData = await Trip.findOne({ _id: tripId }).exec()
      if (!tripData) throw new NotFoundError('NOT_FOUND|TRIP')

      const getCoords = await RoutePath.findOne({ _id: tripData.wayPointId })
      if (!getCoords) throw new BadRequestError('NOT_FOUND|ROUTEPATH')

      // Getting Request List
      // Determine trip direction
      // const startCoords = tripData.location.startCoords.coordinates
      // const endCoords = tripData.location.endCoords.coordinates

      const getRequests = await Request.distinct('postId', {
        tripId: tripData._id
      })

      if (postId && !getRequests.some((obj) => obj.equals(postId))) {
        throw new BadRequestError('INVALID|POST')
      }

      // const commonRequestQuery = []
      if (queryData.status == Enum.TRIP.STATUS.ACCEPTED) {
        matchQuery['request.status'] = Enum.TRIP.STATUS.ACCEPTED
      }
      if (queryData.status == Enum.TRIP.STATUS.REQUESTED) {
        matchQuery['request.status'] = Enum.TRIP.STATUS.REQUESTED
      }
      if (queryData.status == Enum.TRIP.STATUS.DECLINED) {
        matchQuery['request.status'] = Enum.TRIP.STATUS.DECLINED
      }

      const pipeline = [
        {
          $match: {
            _id: { $in: postId ? [mongoose.Types.ObjectId(postId)] : getRequests }
          }
        },
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
                    $and: [{ $eq: ['$postId', '$$postId'] }, { $eq: ['$tripId', tripData._id] }]
                  }
                }
              }
            ],
            as: 'request'
          }
        },
        { $unwind: '$request' },
        { $match: matchQuery }
      ]
      const postCount = await Post.aggregate([...pipeline, { $count: 'totalCount' }])
      let posts = await Post.aggregate([
        ...pipeline,
        { $sort: { 'request.createdAt': -1 } },
        { $skip: skip },
        { $limit: perPage }
        // {
        //   $facet: {
        //     acceptedRequest: [
        //       { $match: { 'request.status': Enum.TRIP.STATUS.ACCEPTED } },
        //       { $skip: skip },
        //       { $limit: perPage }
        //     ],
        //     allRequest: [
        //       { $match: { 'request.status': { $ne: Enum.TRIP.STATUS.ACCEPTED } } },
        //       { $skip: skip },
        //       { $limit: perPage }
        //     ],
        //     declinedRequest: [
        //       { $match: { 'request.status': Enum.TRIP.STATUS.DECLINED } },
        //       { $skip: skip },
        //       { $limit: perPage }
        //     ]
        //   }
        // }
      ])
      posts = posts.map((post) => ({
        ...post,
        instantBooking: tripData?.instantBooking
      }))

      // Near by posts for suggestions
      // const commonQuery = [
      //   {
      //     $geoNear: {
      //       near: {
      //         type: 'Point',
      //         coordinates: startCoords
      //       },
      //       distanceField: 'distance',
      //       key: 'location.startCoords',
      //       spherical: true
      //     }
      //   },
      //   {
      //     $addFields: {
      //       // Ensure coordinates are treated as numbers
      //       startX: { $arrayElemAt: ['$location.startCoords.coordinates', 0] },
      //       startY: { $arrayElemAt: ['$location.startCoords.coordinates', 1] },
      //       endX: endCoords[0],
      //       endY: endCoords[1],
      //       tripVectorX: { $subtract: [endCoords[0], startCoords[0]] },
      //       tripVectorY: { $subtract: [endCoords[1], startCoords[1]] },
      //       postVectorX: {
      //         $subtract: [
      //           { $arrayElemAt: ['$location.endCoords.coordinates', 0] },
      //           { $arrayElemAt: ['$location.startCoords.coordinates', 0] }
      //         ]
      //       },
      //       postVectorY: {
      //         $subtract: [
      //           { $arrayElemAt: ['$location.endCoords.coordinates', 1] },
      //           { $arrayElemAt: ['$location.startCoords.coordinates', 1] }
      //         ]
      //       }
      //     }
      //   },
      //   {
      //     $addFields: {
      //       dotProduct: {
      //         $add: [
      //           { $multiply: ['$tripVectorX', '$postVectorX'] },
      //           { $multiply: ['$tripVectorY', '$postVectorY'] }
      //         ]
      //       },
      //       sortPriority: {
      //         $cond: {
      //           if: { $eq: ['$_id', mongoose.Types.ObjectId(queryData.suggestionId)] },
      //           then: 1,
      //           else: 0
      //         }
      //       }
      //     }
      //   },
      //   {
      //     $match: {
      //       $expr: {
      //         $gte: ['$dotProduct', 0] // Ensure only posts in the direction of the trip
      //       }
      //     }
      //   },
      //   {
      //     $match: {
      //       _id: { $nin: getRequests },
      //       status: Enum.TRIP.STATUS.PUBLISHED,
      //       $and: [
      //         {
      //           $or: getCoords.route.coordinates.map((coord) => ({
      //             'location.startCoords.coordinates': {
      //               $geoWithin: {
      //                 $centerSphere: [[coord[0], coord[1]], 20000 / 6378137]
      //               }
      //             }
      //           }))
      //         },
      //         {
      //           $or: getCoords.route.coordinates.map((coord) => ({
      //             'location.endCoords.coordinates': {
      //               $geoWithin: {
      //                 $centerSphere: [[coord[0], coord[1]], 20000 / 6378137]
      //               }
      //             }
      //           }))
      //         }
      //       ]
      //     }
      //   },
      //   {
      //     $sort: {
      //       sortPriority: -1,
      //       _id: -1
      //     }
      //   }
      // ]

      // console.log(JSON.stringify(commonQuery))

      // const suggestionCount = await Post.aggregate([...commonQuery, { $count: 'totalCount' }])
      // const suggestions = await Post.aggregate([...commonQuery, { $skip: skip }, { $limit: perPage }])

      const returnData = {
        // acceptedList: requestList[0]?.acceptedRequest || [],
        // requestList: requestList[0]?.allRequest || [],
        // declinedList: requestList[0]?.declinedRequest || [],
        postLists: posts,
        total: postCount[0]?.totalCount || 0,
        // suggestions,
        // total: suggestionCount[0]?.totalCount || 0,
        message: 'NEARBY|POSTS'
      }
      return requestHandler.sendSuccess(req, res, 'GET_MATCHED_USERS')(returnData)
    } catch (error) {
      console.log(error)
      return requestHandler.sendError(req, res, error)
    }
  }

  // Get Requests
  static getRequests = async (req, res) => {
    try {
      const { userId } = req.auth
      const queryData = req.query
      let requestData
      // const perPage = Number(queryData.limit) || 10
      // const page = Number(queryData.page) || 1
      // const skip = page * perPage - perPage || 0
      if (queryData.type == 'postier') {
        requestData = await Trip.aggregate([
          {
            $match: { userId: mongoose.Types.ObjectId(userId) }
          },
          {
            $lookup: {
              from: 'requests',
              let: {
                transmitterId: '$transmitterId',
                tripId: '$_id'
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ['$tripId', '$$tripId'] }, { $eq: ['$status', 'Requested'] }]
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'bidding.userId',
                    foreignField: '_id',
                    as: 'userInfo'
                  }
                }
              ],
              as: 'requestDetails'
            }
          },
          {
            $addFields: { requestCount: { $size: '$requestDetails' } }
          },
          { $sort: { _id: -1 } }
          // { $skip: skip },
          // { $limit: perPage }
        ])
      } else if (queryData.type == 'user') {
        requestData = await Post.aggregate([
          {
            $match: { userId: mongoose.Types.ObjectId(userId) }
          },
          {
            $lookup: {
              from: 'requests',
              let: {
                transmitterId: '$transmitterId',
                postId: '$_id'
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ['$postId', '$$postId'] }, { $eq: ['$status', 'Requested'] }]
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'users',
                    localField: 'bidding.userId',
                    foreignField: '_id',
                    as: 'userInfo'
                  }
                }
              ],
              as: 'requestDetails'
            }
          },
          {
            $addFields: { requestCount: { $size: '$requestDetails' } }
          },
          { $sort: { _id: -1 } }
          // { $skip: skip },
          // { $limit: perPage }
        ])
      } else throw new BadRequestError('INVALID_TYPE')

      // if (queryData.type == 'postier') {
      //   const trip = await Trip.find({ userId })
      //   matchCond['tripId'] = { $in: trip.map((data) => data._id) }
      //   lookupStage = {
      //     from: 'trips',
      //     localField: 'tripId',
      //     foreignField: '_id',
      //     as: 'tripDetails'
      //   }
      // } else if (queryData.type == 'user') {
      //   const post = await Post.find({ userId })
      //   matchCond['postId'] = { $in: post.map((data) => data._id) }
      //   lookupStage = {
      //     from: 'posts',
      //     localField: 'postId',
      //     foreignField: '_id',
      //     as: 'postDetails'
      //   }
      // } else throw new BadRequestError('INVALID_TYPE')

      // if (queryData.filter == 'given') {
      //   matchCond['transmitterId'] = mongoose.Types.ObjectId(userId)
      // } else if (queryData.filter == 'received') {
      //   matchCond['transmitterId'] = { $ne: mongoose.Types.ObjectId(userId) }
      // }
      // const requests = await Request.aggregate([
      //   { $match: matchCond },
      //   { $lookup: lookupStage },
      //   { $sort: { _id: -1 } },
      //   { $skip: skip },
      //   { $limit: perPage }
      // ])

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_REQUESTS'
      )({
        message: 'REQUESTS|LISTED',
        requests: requestData || []
      })
    } catch (error) {
      console.log(error, 'error')
      return requestHandler.sendError(req, res, error)
    }
  }

  // receiverTracking
  static receiverTracking = async (req, res) => {
    try {
      const { trackingId } = req.query
      console.log(trackingId, 'trackingId')

      if (!trackingId) throw new BadRequestError('MISSING_TRACKING_ID')
      const post = await Post.findOne({ consignmentNo: trackingId }).populate('tripId')
      console.log(post, 'post')

      if (!post) throw new NotFoundError('NOT_FOUND|POST')

      // getRoutes
      const routePathData = await RoutePath.findOne(
        { _id: mongoose.Types.ObjectId(post.tripId.wayPointId) },
        { route: 1, overviewPolyline: 1 }
      )
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_RECEIVER_TRACKING'
      )({
        message: 'SUCCESS',
        post: post,
        route: routePathData
      })
    } catch (error) {
      console.log(error, 'error')
      return requestHandler.sendError(req, res, error)
    }
  }

  // Dynamic Calculation
  static dynamicCalculation = async (req, res) => {
    try {
      const {
        pickupLat,
        pickupLng,
        dropLat,
        dropLng,
        width,
        height,
        length,
        weight,
        urgencyLevel,
        parcelType,
        distanceCostFactor
      } = req.body
      const pickupLocation = pickupLat + ',' + pickupLng
      const dropLocation = dropLat + ',' + dropLng

      // Calculate Volumetric Weight
      const volumetricWeight = (width * height * length) / 5000
      const highestWeight = Math.max(volumetricWeight, weight)

      // Calculate distance via great-circle distance (Haversine formula)
      const totalDistance = await MapServices.calculateDistanceBetweenTwoPoints(
        [pickupLocation],
        [dropLocation]
      )

      const greatCircleDistanceKM = Helpers.roundOff(totalDistance) // Total distance in KM

      const distanceDiscountMultiplier =
        greatCircleDistanceKM <= 300
          ? 1
          : greatCircleDistanceKM <= 700
          ? 0.9
          : greatCircleDistanceKM <= 1200
          ? 0.8
          : 0.7

      const urgencyType = urgencyLevel

      const urgencyFareMultiplier = urgencyType == 'express' ? 1.5 : urgencyType == 'sameDay' ? 2 : 1

      const parcelTypeData = parcelType

      const parcelTypeFareMultiplier =
        parcelTypeData == 'fragile'
          ? 1.2
          : parcelTypeData == 'oversized'
          ? 1.3
          : parcelTypeData == 'temperatureSensitive'
          ? 1.5
          : 1

      // Weight fare discount multiplier
      const weightDiscountMultiplier =
        highestWeight >= 11 && highestWeight <= 30
          ? 0.95
          : highestWeight >= 31 && highestWeight <= 70
          ? 0.9
          : highestWeight > 70
          ? 0.85
          : 1

      const maxDimension = Math.max(width, height, length)

      const sizeDiscountMultiplier =
        maxDimension >= 100 && maxDimension <= 150 ? 0.95 : maxDimension > 150 ? 0.9 : 1

      // Step 1: Use the highest weight
      const highWeight = highestWeight

      // Step 2: Calculate distance cost
      const distanceCost = Helpers.roundOff(greatCircleDistanceKM * distanceCostFactor)

      // Step 3: Apply distance discount
      const discountDistance = Helpers.roundOff(distanceCost * distanceDiscountMultiplier)

      // Step 4: Apply Base Fare
      const baseFare = discountDistance + Config.app.baseFare

      // Step 5: Apply Urgency Multiplier
      const urgencyMultiplier = Helpers.roundOff(baseFare * urgencyFareMultiplier)

      // Step 6: Apply Delivery Type Multiplier
      const deliveryTypeMultiplier = Helpers.roundOff(urgencyMultiplier * parcelTypeFareMultiplier)

      // Step 7: Apply weight discount
      const weightDiscount = Helpers.roundOff(deliveryTypeMultiplier * weightDiscountMultiplier)

      // Step 8: Apply size discount
      const sizeDiscount = Helpers.roundOff(weightDiscount * sizeDiscountMultiplier)

      // Final price
      const totalFare = sizeDiscount

      const estimation = {
        height: height,
        width: width,
        length: length,
        actualWeight: weight,
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
        highestWeight: highWeight,
        baseFare: Config.app.baseFare,
        finalPrice: totalFare
      }

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_DYNAMIC_CALCULATION'
      )({
        dynamicCalculation: estimation
      })
    } catch (error) {
      console.error('DYNAMIC_CALCULATION_ERROR', error)
      return requestHandler.sendError(req, res, error)
    }
  }
}

export { RequestController }
