/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */

import { BaseController } from '../BaseController.js'
import { RequestHandler } from '../../utils/RequestHandler.js'
import { Logger } from '../../utils/Logger.js'
import { Config } from '../../config/AppConfig.js'
import { Enum } from '../../utils/Enum.js'
import { CreteriaService } from '../../services/Creteria/CreteriaServices.js'
import fs from 'fs'
import path from 'path'

const logger = new Logger()
const requestHandler = new RequestHandler(logger)

class ConfigController extends BaseController {
  constructor() {
    super()
  }

  static getConfiguration = async (req, res) => {
    try {
      const configData = {
        app: {
          name: Config.app.name,
          language: Config.app.language,
          phoneCode: Config.app.phoneCode,
          currency: Config.app.currency,
          utcOffset: Config.app.utcOffset,

          logo: Config.app.logo,
          favicon: Config.app.favicon,
          baseurl: Config.app.baseurl,
          shareTrip: Config.app.shareTrip
        },
        locale: Config.locale,
        google: {
          mapId: Config.google.mapId,
          googleClientId: Config.google.googleClientId,
          googleClientSecret: Config.google.googleClientSecret,
          mapApiKey: Config.google.mapApiKey,
          mapServerKey: Config.google.mapServerKey,
          androidKey: Config.google.androidKey,
          iosKey: Config.google.iosKey
        }
      }
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_ALL_CONFIG'
      )({ message: 'PROVIDED|CONFIG DATA', data: configData })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateAppConfig = async (req, res) => {
    try {
      const body = req.body
      const configObj = Config

      const localeArr =
        body.locale && body.locale != '' ? configObj.locale.concat(body.locale.split(',')) : configObj.locale

      configObj.app.name = body.name || configObj.app.name
      configObj.app.language = body.language || configObj.app.language
      configObj.app.phoneCode = body.phoneCode || configObj.app.phoneCode
      configObj.app.currency = body.currency || configObj.app.currency
      configObj.app.baseurl = body.baseurl || configObj.app.baseurl
      configObj.app.shareTrip = body.shareTrip || configObj.app.shareTrip

      if (
        body.distanceMetric &&
        [
          Enum.TRIP.DISTANCEMETRIC.METER,
          Enum.TRIP.DISTANCEMETRIC.KILOMETER,
          Enum.TRIP.DISTANCEMETRIC.MILE
        ].includes(body.distanceMetric)
      )
        configObj.app.distanceMetric = body.distanceMetric || configObj.app.distanceMetric

      configObj.google.mapId = body.mapId || configObj.google.mapId
      configObj.google.googleClientId = body.googleClientId || configObj.google.googleClientId
      configObj.google.googleClientSecret = body.googleClientSecret || configObj.google.googleClientSecret
      configObj.google.mapApiKey = body.mapApiKey || configObj.google.mapApiKey
      configObj.google.mapServerKey = body.mapServerKey || configObj.google.mapServerKey
      configObj.google.androidKey = body.androidKey || configObj.google.androidKey
      configObj.google.iosKey = body.iosKey || configObj.google.iosKey

      if (req.files && req.files.length > 0) {
        // Logo Update
        const logo = req.files.find((elem) => elem.fieldname == 'logo')
        if (logo) {
          await CreteriaService.moveFile(logo.path, '/public/logo.png')
          configObj.app.logo = logo.path
        }
        // Logo Update
        const favicon = req.files.find((elem) => elem.fieldname == 'favicon')
        if (favicon) {
          await CreteriaService.moveFile(favicon.path, '/public/favicon.ico')
          configObj.app.favicon = favicon.path
        }
      }

      configObj.locale = localeArr

      const __dirname = path.resolve()
      const filePath = `${__dirname}/config/AppConfig.js`
      const fileContent = `/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
const Config = ${JSON.stringify(configObj, null, 2)}
export { Config }`

      await fs.writeFileSync(filePath, fileContent)

      const configData = {
        app: {
          name: Config.app.name,
          language: Config.app.language,
          phoneCode: Config.app.phoneCode,
          currency: Config.app.currency,
          utcOffset: Config.app.utcOffset,

          logo: Config.app.logo,
          favicon: Config.app.favicon,
          baseurl: Config.app.baseurl,
          shareTrip: Config.app.shareTrip
        },
        locale: Config.locale,
        google: {
          mapId: Config.google.mapId,
          googleClientId: Config.google.googleClientId,
          googleClientSecret: Config.google.googleClientSecret,
          mapApiKey: Config.google.mapApiKey,
          mapServerKey: Config.google.mapServerKey,
          androidKey: Config.google.androidKey,
          iosKey: Config.google.iosKey
        }
      }

      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_CONFIG'
      )({ message: 'UPDATED|CONFIG DATA', configuration: configData })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }
}

export { ConfigController }
