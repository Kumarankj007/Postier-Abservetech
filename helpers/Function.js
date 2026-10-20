/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */

import { Config } from '../config/AppConfig.js'
import GoogleDistanceMatrix from 'google-distance-matrix'
import randomize from 'randomatic'
import moment from 'moment'
import crypto from 'crypto'

// import { FirebaseServices } from '../services/FirebaseService.js'

import { BaseController } from '../controllers/BaseController.js'
import Channel from '../modules/Socket/models/Channels.js'
import { BadRequestError } from '../utils/ErrorHandler.js'
GoogleDistanceMatrix.key(Config.google.mapServerKey)
class Helpers extends BaseController {
  constructor() {
    super()
  }

  static sendRandomizeCode = (no = 4) => {
    try {
      if (Config.mode == 'dev') {
        return 1111
      }
      const min = Math.pow(10,no - 1)
      const max = Math.pow(10, no) - 1

      const otp = Math.floor(Math.random() * (max - min + 1)) + min
      return otp.toString()
    } catch (error) {
      return error
    }
  }

  static generateInvoiceNo = () => {
    try {
      return Array.from({ length: 4 }, () => {
        const buffer = crypto.randomBytes(2)
        const num = buffer.readUInt16BE() % 1000
        return String(num).padStart(3, '0')
      }).join('-')
    } catch (error) {
      return error
    }
  }

  static generateConsignmentNo = () => {
    try {
      const prefix = 'PSTR'
      const result = crypto.randomBytes(4).toString('hex').toUpperCase()
      return `${prefix}${result}`
    } catch (error) {
      return error
    }
  }

  /**
 ..* Send Formated Now Time
   * @input
   * @param
   * @return null
 * @response null
 */
  static sendFormatedTime = (timeformat = 'M-D-YYYY h:mm a', time = Date(), utcOffset = '+00:00') => {
    const t = moment(time).utcOffset(utcOffset).format(timeformat)
    return t
  }

  static getISODate = (timeformat = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]') => {
    // will return the current time in India.
    const t = moment().utcOffset(Config.app.utcOffset).format(timeformat)
    return t
  }

  static roundOff = (value) => {
    let returnValue = 0
    const dataType = typeof value
    try {
      if (['number', 'string'].includes(typeof dataType) && dataType != NaN) {
        returnValue = Number(parseFloat(value).toFixed(2))
      }
    } catch (error) {
      console.log(error, 'round Values To Two Digits')
    }
    return returnValue
  }

  static getDateDifference = (from, to) => {
    let returnData = {
      month: 0,
      year: 0,
      accuracy: 0
    }
    try {
      const fromDate = new Date(from)
      const toDate = new Date(to)
      if (isNaN(fromDate) || isNaN(toDate)) throw new BadRequestError('Unprocessable Entry')

      const diffYear = toDate.getFullYear() - fromDate.getFullYear()
      const monthDiff = diffYear * 12 + (toDate.getMonth() - fromDate.getMonth())

      returnData = {
        month: monthDiff,
        year: diffYear,
        accuracy: Number((monthDiff / 12).toFixed(1) || 0)
      }
    } catch (error) {
      console.error('getDateDifference', error)
      returnData = {
        month: 0,
        year: 0,
        accuracy: 0
      }
    }
    return returnData
  }

  static verifyChannelUser = async (data) => {
    const { channelId } = data
    const channelData = await Channel.findOne({ _id: channelId })
      .populate({
        path: 'channelUsers'
        // match: { userId: mongoose.Types.ObjectId(userId) }
      })
      .lean()
      .exec()

    if (!channelData || !channelData.channelUsers) throw new NotFoundError('CHANNEL_NOT_EXITS')

    const findIndex = channelData.channelUsers.findIndex((i) => i.userId)
    if (findIndex === -1) throw new BadRequestError('NO_ACCESS')

    return channelData
  }
}

export { Helpers }
