/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import { Logger } from '../../utils/Logger.js'
import { RequestHandler } from '../../utils/RequestHandler.js'
import Suggestion from './Suggestion.js'
const logger = new Logger()
const requestHandler = new RequestHandler(logger)
/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
class SuggestionController {
  constructor() {}

  static addSuggestions = async (req, res) => {
    try {
      const body = req.body
      const userId = req.auth.userId || body.userId
      let suggestion

      if (!body.primaryAddress || !body.secondaryAddress) {
        throw new Error('NOT_FOUND|ADDRESS')
      }

      suggestion = await Suggestion.findOne({
        userId,
        primaryAddress: body.primaryAddress,
        secondaryAddress: body.secondaryAddress
      })
      if (suggestion) {
        suggestion.frequency += 1
        suggestion.lastSearch = new Date()
        await suggestion.save()
      } else {
        const lng = Number(parseFloat(body.lng).toFixed(4))
        const lat = Number(parseFloat(body.lat).toFixed(4))
        suggestion = await Suggestion.create({
          userId,
          primaryAddress: body.primaryAddress,
          secondaryAddress: body.secondaryAddress,
          place_id: body.place_id,
          coordinates: [lng, lat],
          frequency: 1,
          lastSearch: new Date(),
          city: body.city
        })
      }

      return requestHandler.sendSuccess(
        req,
        res,
        'ADDED_SUGGESTION'
      )({ message: 'CREATED|SUGGESTION', suggestion })
    } catch (error) {
      console.log(error)
      return requestHandler.sendError(req, res, error)
    }
  }

  static getSuggestions = async (req, res) => {
    try {
      const queryData = req.query
      const userId = req.auth.userId || queryData.userId
      const findCondition = { userId }

      if (queryData.search) {
        const search = { $regex: queryData.search, $options: 'i' }
        findCondition['$or'] = [{ primaryAddress: search }, { secondaryAddress: search }]
      }

      const suggestion = await Suggestion.find(findCondition).sort({ frequency: -1, lastSearch: -1 }).limit(5)

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_SUGGESTIONS'
      )({ message: 'LISTED|SUGGESTIONS', suggestion })
    } catch (error) {
      console.log(error)
      return requestHandler.sendError(req, res, error)
    }
  }
}

export { SuggestionController }
