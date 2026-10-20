/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'

import Channel from './models/Channels.js'
// import Trip from '../../models/Service/Trip.js'
// import Post from '../../models/Service/Trip.js'
// import ChannelUser from './models/ChannelUsers.js'
// import User from '../../models/Auth/User.js'
// import Admin from '../../models/Auth/Admin.js'
import Messages from './models/Messages.js'
import MessageDelivery from './models/MessageDelivery.js'
import ChannelUsers from './models/ChannelUsers.js'

// import { NotifcationController } from '../../controllers/Notification/Index.js'
import { SocketIO } from './index.js'
import { RedisHelper } from '../../helpers/RedisHelper.js'
import { Helpers as Helper } from '../../helpers/Function.js'
import { SocketMiddleware } from '../../middlewares/SocketMiddleware.js'
import { Enum } from '../../utils/Enum.js'
import { BadRequestError, /* NotFoundError, */ UnprocessableError } from '../../utils/ErrorHandler.js'

const { authorize } = SocketMiddleware
const RedisDB = new RedisHelper()
const ChatRequest = SocketIO.of('/chatRequest')
ChatRequest.use(authorize)

const sendNotification = async (data) => {
  try {
    /* const { content, title, template = '', templateData = {}, userId, userRole = Enum.ROLES.USER } = data
    if (!content || !title || !userId || !userRole) throw new BadRequestError('BAD_REQUEST')

    let pushToken = null
    if (userRole == Enum.ROLES.USER) {
      const user = await User.findOne({ _id: mongoose.Types.ObjectId(userId) }, { fcmId: 1 })
        .lean()
        .exec()
      pushToken = user.fcmId || null
    } else {
      throw new BadRequestError('BAD_REQUEST')
    }
    if (!pushToken) throw new BadRequestError('BAD_REQUEST')
    await NotifcationController.createNotification({
      processType: [Enum.NOTIFICATION.TYPE.PUSHNOTIFICATION],
      data: {
        pushToken: pushToken,
        title: title,
        body: content,
        template: template,
        templateData: templateData
      }
    }) */
  } catch (error) {
    console.error('Chat Notification: ', error)
  }
}

// const verifyChannelUser = async (data) => {
//   const { channelId } = data
//   const channelData = await Channel.findOne({ _id: channelId })
//     .populate({
//       path: 'channelUsers'
//       // match: { userId: mongoose.Types.ObjectId(userId) }
//     })
//     .lean()
//     .exec()

//   if (!channelData || !channelData.channelUsers) throw new NotFoundError('CHANNEL_NOT_EXITS')

//   const findIndex = channelData.channelUsers.findIndex((i) => i.userId)
//   if (findIndex === -1) throw new BadRequestError('NO_ACCESS')

//   return channelData
// }

ChatRequest.on('connection', async (socket) => {
  try {
    socket.on('connectChatRequest', async (data, callback) => {
      let response = {
        data: {},
        message: 'SERVICE_UNAVAILABLE',
        status: false,
        code: 503
      }
      try {
        const { channelId = null /* tripId = null, postId = null, supportId = null*/ } = data
        const { userId, role } = socket.authInfo
        if (!userId || !channelId) throw new UnprocessableError('UNPROCESSABLE_REQUEST')

        const channelData = await Helper.verifyChannelUser({ channelId, userId })
        if (!channelData) throw new BadRequestError('NOT_ALLOWED')

        const conChannel = `${Enum.SOCKET.CHAT}_${channelId}`
        console.log('CONCHANNEL', conChannel)

        socket.join(conChannel)
        await RedisDB.__addChatUser({ userId, role, socketId: socket.id })
        response = {
          data: {
            conChannel: conChannel,
            channelId: channelId,
            userId: userId
          },
          message: 'CONNECTION_ESTABLISED',
          status: true,
          code: 200
        }
        console.log('connectChatRequest', JSON.stringify(response))
      } catch (Error) {
        response = {
          data: {},
          message: Error.message,
          status: false,
          code: 500
        }
      }
      if (typeof callback === 'function') callback(response)
    })

    socket.on('sendMessage', async (data, callback) => {
      let response = {
        data: {},
        message: 'SERVICE_UNAVAILABLE',
        status: false,
        code: 503
      }
      try {
        const { channelId = null, content, type = 'text', contextid = null, status } = data
        const nowDate = new Date()

        const { userId, role } = socket.authInfo
        if (!channelId || !userId) throw new UnprocessableError('UNPROCESSABLE_REQUEST')

        const channelData = await Helper.verifyChannelUser({ channelId, userId })
        if (!channelData) throw new BadRequestError('NOT_ALLOWED')

        const message = {
          userId: userId,
          userType: role,
          channelId: channelId,
          type: type,
          content: content,
          context: contextid,
          status: status
        }
        console.log('message', message)

        const newMessage = await Messages.create(message)
        if (!newMessage) throw new BadRequestError('MESSAGE_NOT_STORED')

        const messageInfo = []
        // Have to collect opposite user and send notification promtly
        if (channelData.channelUsers) {
          for (const channelUsers of channelData.channelUsers) {
            const newDelivery = await MessageDelivery.create({
              messageId: newMessage._id,
              senderId: userId,
              channelId: channelId,
              receiverId: channelUsers.userId,
              seenAt: channelUsers.userId.equals(userId) ? nowDate : null
            })

            if (!channelUsers.userId.equals(userId)) {
              // Increase unseen count by 1 for the recipient
              await ChannelUsers.findOneAndUpdate(
                { channelId: channelId, userId: channelUsers.userId },
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

        ChatRequest.to(`${Enum.SOCKET.CHAT}_${channelId}`).emit('messageBroadcast', {
          data: {
            messages: messageInfo
          }
        })

        response = {
          data: {
            messages: messageInfo
          },
          message: 'MESSAGE_DELIVERED',
          status: true,
          code: 200
        }
      } catch (error) {
        console.log(error)
        response = {
          data: {},
          message: error.message,
          status: false,
          code: 500
        }
      }
      if (typeof callback === 'function') callback(response)
    })

    socket.on('seenMessage', async (data, callback) => {
      let response = {
        data: {},
        message: 'SERVICE_UNAVAILABLE',
        status: false,
        code: 503
      }
      try {
        const nowDate = new Date()
        const { channelId = null } = data
        const { userId } = socket.authInfo
        if (!channelId || !userId) throw new UnprocessableError('UNPROCESSABLE_REQUEST')
        const channelData = await Channel.findOne({
          _id: mongoose.Types.ObjectId(channelId)
          // creatorId: mongoose.Types.ObjectId(userId)
        })
          .lean()
          .exec()
        if (!channelData) throw new BadRequestError('NOT_ALLOWED')

        const findData = await MessageDelivery.distinct('messageId', {
          channelId: channelId,
          createdAt: { $lte: nowDate },
          senderId: { $ne: userId }
        })
        if (findData && findData.length > 0) {
          await MessageDelivery.updateMany(
            {
              channelId: channelId,
              messageId: { $in: findData },
              seenAt: null,
              createdAt: { $lte: nowDate }
            },
            { $set: { seenAt: nowDate, updatedAt: nowDate } }
          )
          await Messages.updateMany(
            {
              channelId: channelId,
              _id: { $in: findData },
              seen: false,
              createdAt: { $lte: nowDate }
            },
            { $set: { seen: true, updatedAt: nowDate } }
          )

          // Reset unseen count in channelUsers collection
          await ChannelUsers.updateOne(
            {
              channelId: mongoose.Types.ObjectId(channelId),
              userId: mongoose.Types.ObjectId(userId)
            },
            { $set: { unseen: 0, updatedAt: nowDate } }
          )

          ChatRequest.to(`${Enum.SOCKET.CHAT}_${channelId}`).emit('messageSawBroadcast', {
            data: {
              userId: userId,
              date: nowDate,
              channelId: channelId
            }
          })
        }
        response = {
          data: {
            userId: userId,
            date: nowDate,
            channelId: channelId
          },
          message: 'MESSAGES_UPDATED_TO_SEEN',
          status: true,
          code: 200
        }
      } catch (error) {
        console.log(error)
        response = {
          data: {},
          message: error.message,
          status: false,
          code: 500
        }
      }
      if (typeof callback === 'function') callback(response)
    })

    socket.on('disconnect', async (data, callback) => {
      let response = {
        data: {},
        message: 'SERVICE_UNAVAILABLE',
        status: false,
        code: 503
      }
      try {
        const { userId } = socket.authInfo
        console.log('SocketChanneldisconnect!')
        socket.leaveAll()

        if (userId) {
          const removeChannelUser = await RedisDB.__getChatUser({ userId })
          if (removeChannelUser) {
            await RedisDB.__deleteChannelUser({ userId })
          }
        }
        response = {
          data: {},
          message: 'USER_REMOVED_FROM_REDIS',
          status: true,
          code: 200
        }
      } catch (Error) {
        response = {
          data: {},
          message: Error.message,
          status: false,
          code: 500
        }
      }
      if (typeof callback === 'function') callback(response)
    })
  } catch (error) {
    console.error('Rooms Connect Issue :', error)
  }
})

export { ChatRequest }
