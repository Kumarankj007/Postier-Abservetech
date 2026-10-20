/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { BaseController } from '../BaseController.js'
import User from '../../models/Auth/User.js'
import Posts from '../../models/Service/Post.js'
import Trips from '../../models/Service/Trip.js'
import Vehicle from '../../models/Creteria/Vehicle.js'
import ServiceType from '../../models/Creteria/ServiceType.js'
import { Enum } from '../../utils/Enum.js'
import { RequestHandler } from '../../utils/RequestHandler.js'
import { Logger } from '../../utils/Logger.js'
import { BadRequestError } from '../../utils/ErrorHandler.js'

const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class ReportController extends BaseController {
  constructor() {
    super()
  }

  static dashboard = async (req, res) => {
    try {
      const response = { message: 'DASHBOARD' }
      const paramsData = req.params
      const queryData = req.query

      let setDate = new Date(queryData.date)
      if (isNaN(setDate)) setDate = new Date()
      const setDateYear = setDate.getFullYear()
      const setDateMonth = setDate.getMonth()

      if (!paramsData.requestType || paramsData.requestType === 'totalRecord') {
        const totalRecord = {
          users: 0,
          parcels: 0,
          trips: 0,
          vehicles: 0,
          services: 0
        }

        totalRecord.users = (await User.countDocuments({})) || 0
        totalRecord.parcels = (await Posts.countDocuments({})) || 0
        totalRecord.trips = (await Trips.countDocuments({})) || 0
        totalRecord.vehicles = (await Vehicle.countDocuments({})) || 0
        totalRecord.services = (await ServiceType.countDocuments({})) || 0
        response['totalRecord'] = totalRecord
      }

      if (!paramsData.requestType || paramsData.requestType === 'tripEarning') {
        const monthStart = new Date(setDateYear, setDateMonth, 1)
        const monthEnd = new Date(setDateYear, setDateMonth + 1, 0, 23, 59, 59, 999)

        const tripEarningArr = await Posts.aggregate([
          {
            $match: {
              status: Enum.TRIP.STATUS.DELIVERED,
              updatedAt: {
                $gte: monthStart, // Start of day
                $lt: monthEnd // End of day
              }
            }
          },
          {
            $group: {
              _id: null,
              admin: { $sum: '$parcel.commisonAmount' },
              postier: { $sum: '$parcel.tripPayable' },
              trip: { $sum: '$parcel.fare' }
            }
          }
        ])

        const tripEarning = {
          admin: (tripEarningArr?.[0]?.admin || 0).toFixed(2),
          partner: (tripEarningArr?.[0]?.postier || 0).toFixed(2),
          trip: (tripEarningArr?.[0]?.trip || 0).toFixed(2)
        }
        response['tripEarning'] = tripEarning
      }

      if (!paramsData.requestType || paramsData.requestType === 'tripReport') {
        const queryObject = {}
        let dateRangeQuery = { $dayOfMonth: '$createdAt' }
        if (queryData.dateRange === 'year') {
          console.log('ENTERED')

          dateRangeQuery = { $month: '$createdAt' }
        } else if (queryData.dateRange == 'week') {
          const dayOfWeek = setDate.getDay()
          const weekStart = new Date(setDate)
          weekStart.setDate(setDate.getDate() - dayOfWeek)
          weekStart.setHours(0, 0, 0, 0)

          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          weekEnd.setHours(23, 59, 59, 999)

          queryObject['createdAt'] = { $gte: weekStart, $lt: weekEnd }
          dateRangeQuery = { $dayOfWeek: '$createdAt' }
        } else {
          // const setDate = new Date(queryData.date) || new Date()
          // const setDateYear = setDate.getFullYear()
          const dayStart = new Date(setDateYear, setDateMonth, 1)
          const dayEnd = new Date(setDateYear, setDateMonth + 1, 0, 23, 59, 59, 999)
          queryObject['createdAt'] = { $gte: dayStart, $lt: dayEnd }
        }

        const tripReport = await Posts.aggregate([
          {
            $match: queryObject
          },
          {
            $project: {
              paymentStatus: 1,
              month: dateRangeQuery,
              date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
            }
          },
          {
            $group: {
              _id: { paymentStatus: '$paymentStatus', month: '$month' },
              count: { $sum: 1 },
              date: { $first: '$date' }
            }
          },
          {
            $group: {
              _id: '$_id.month',
              value: {
                $push: {
                  status: '$_id.paymentStatus',
                  count: '$count'
                }
              },
              count: { $sum: '$count' },
              date: { $first: '$date' }
            }
          },
          {
            $project: {
              _id: '$_id',
              value: {
                $filter: {
                  input: '$value',
                  as: 'item',
                  cond: { $eq: ['$$item.status', 'PAID'] }
                }
              },
              count: '$count',
              date: '$date'
            }
          }
        ])
        response['tripReport'] = tripReport
      }
      return requestHandler.sendSuccess(req, res, 'SITE_STATISTICS')(response)
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static siteStatistics = async (req, res) => {
    try {
      const response = { message: 'SITE_STATISTICS' }
      const paramData = req.params
      const queryData = req.query
      let setDate = new Date(queryData.date)
      if (isNaN(setDate)) setDate = new Date()
      const setDateYear = setDate.getFullYear()

      let dateRangeQuery = { $dayOfMonth: '$createdAt' }
      if (queryData.dateRange == 'year') {
        dateRangeQuery = { $month: '$createdAt' }
      }
      const dayStart = new Date(setDateYear, queryData.dateRange !== 'year' ? setDate.getMonth() : 0, 1)
      const dayEnd = new Date(
        setDateYear,
        queryData.dateRange !== 'year' ? setDate.getMonth() + 1 : 12,
        0,
        23,
        59,
        59,
        999
      )

      if (!paramData.requestType || paramData.requestType == 'tripReport') {
        const tripReportQuery = {
          status: Enum.TRIP.STATUS.FINISHED,
          createdAt: { $gte: dayStart, $lt: dayEnd }
        }
        const tripReport = await Trips.aggregate([
          {
            $match: tripReportQuery
          },
          {
            $group: {
              _id: dateRangeQuery,
              totalAmount: { $sum: '$avgPrice' },
              partner: { $sum: '$payableAmount' },
              admin: { $sum: '$commisonAmount' },
              tax: { $sum: '$taxAmount' },
              date: { $first: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } }
            }
          }
        ])
        response['tripReport'] = tripReport
      } else if (!paramData.requestType || paramData.requestType == 'tripCount') {
        const tripCountQuery = {
          deletedAt: null,
          createdAt: { $gte: dayStart, $lt: dayEnd }
        }
        const tripCountArr = await Trips.aggregate([
          {
            $match: tripCountQuery
          },
          {
            $group: {
              _id: null,
              finished: {
                $sum: {
                  $cond: [{ $eq: ['$status', Enum.TRIP.STATUS.FINISHED] }, 1, 0]
                }
              },
              noResponse: {
                $sum: {
                  $cond: [{ $eq: ['$status', Enum.TRIP.STATUS.PUBLISHED] }, 1, 0]
                }
              }
            }
          }
        ])
        const tripCount = {
          finished: tripCountArr?.[0]?.finished || 0,
          noResponse: tripCountArr?.[0]?.noResponse || 0
        }
        response['tripCount'] = tripCount
      } else if (!paramData.requestType || paramData.requestType == 'postCount') {
        const postCountQuery = {
          deletedAt: null,
          createdAt: { $gte: dayStart, $lt: dayEnd }
        }
        const postCountArr = await Posts.aggregate([
          {
            $match: postCountQuery
          },
          {
            $group: {
              _id: null,
              delivered: {
                $sum: {
                  $cond: [{ $eq: ['$status', Enum.TRIP.STATUS.DELIVERED] }, 1, 0]
                }
              },
              transit: {
                $sum: {
                  $cond: [{ $eq: ['$status', Enum.TRIP.STATUS.TRANSIT] }, 1, 0]
                }
              },
              noResponse: {
                $sum: {
                  $cond: [{ $eq: ['$status', Enum.TRIP.STATUS.PUBLISHED] }, 1, 0]
                }
              }
            }
          }
        ])
        const postCount = {
          delivered: postCountArr?.[0]?.delivered || 0,
          transit: postCountArr?.[0]?.transit || 0,
          noResponse: postCountArr?.[0]?.noResponse || 0
        }
        response['postCount'] = postCount
      } else if (!paramData.requestType || paramData.requestType == 'customerCount') {
        const customerCountQuery = {
          deletedAt: null,
          createdAt: { $gte: dayStart, $lt: dayEnd }
        }
        const customerCount = await User.aggregate([
          {
            $match: customerCountQuery
          },
          {
            $project: {
              month: { $month: '$createdAt' }
            }
          },
          {
            $group: {
              _id: '$month',
              count: { $sum: 1 }
            }
          }
        ])
        response['customerCount'] = customerCount
      } else throw new BadRequestError('INVALID_REQUEST|TYPE')

      return requestHandler.sendSuccess(req, res, 'SITE_STATISTICS')(response)
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }
}

export { ReportController }
