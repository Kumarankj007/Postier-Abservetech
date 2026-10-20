/* ************************
 * Copyright 2023
 * ABSERVETECH
 ************************ */
import mongoose from 'mongoose'
import fs from 'fs'
import { BaseController } from './../BaseController.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// import Language from '../../models/DataStore/Language.js'
import Currency from '../../models/DataStore/Currency.js'
import Country from '../../models/DataStore/Country.js'
import State from '../../models/DataStore/State.js'
import City from '../../models/DataStore/City.js'
import Model from '../../models/DataStore/Model.js'
import Make from '../../models/DataStore/Make.js'
import HelpCategory from '../../models/DataStore/HelpCategory.js'
import HelpTopic from '../../models/DataStore/HelpTopic.js'
import VehicleColor from '../../models/DataStore/VehicleColor.js'
import ManufactureYear from '../../models/DataStore/ManufactureYear.js'
import Cms from '../../models/DataStore/Cms.js'
import Setting from '../../models/DataStore/Setting.js'
import FaqCategory from '../../models/DataStore/FaqCategory.js'
import Faq from '../../models/DataStore/Faq.js'
import SeoSetting from '../../models/DataStore/SeoSetting.js'
import VehicleCategory from '../../models/DataStore/VehicleCategory.js'
import ParcelType from '../../models/DataStore/ParcelType.js'
import DeliverParcelType from '../../models/DataStore/DeliverParcelType.js'
import { PresetValidator } from './../../validators/DataStore/PresetValidator.js'
import { PresetService } from '../../services/DataStore/PresetService.js'

// import { Feature } from '../../config/FeatureConfig.js'
import { Enum } from '../../utils/Enum.js'
import { RequestHandler } from './../../utils/RequestHandler.js'
import { Logger } from './../../utils/Logger.js'
import { QueryBuilder } from '../../helpers/QueryBuilder.js'
import { BadRequestError, NotFoundError, UnprocessableError } from '../../utils/ErrorHandler.js'
import path from 'path'

const logger = new Logger()
const requestHandler = new RequestHandler(logger)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class PresetController extends BaseController {
  constructor() {
    super()
  }

  static getServiceModule = async (req, res) => {
    try {
      const moduleData = Feature.modules
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_SERVICE_MODULE'
      )({ message: 'LISTED|MODULE', modules: moduleData })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getLanguageExists = async (req, res) => {
    try {
      const query = req.query

      const validation = await PresetValidator.getLanguageExists(query)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getLanguage(query)
      if (account && account.status) throw new BadRequestError('EXIST|LANGUAGE')

      return requestHandler.sendSuccess(req, res, 'GET_LANGUAGE_EXISTS')({ message: 'NOT_EXIST|LANGUAGE' })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static async getAllLanguages(req, res) {
    try {
      const queryData = req.query
      const paramData = req.params

      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      const queryObj = {}
      if (queryData.title) {
        queryObj.title = { $regex: queryData.title, $options: 'i' }
      }
      if (paramData.id) {
        queryObj._id = mongoose.Types.ObjectId(paramData.id)
      }
      const getDataCount = await Language.find(queryObj).count()
      const getData = await Language.find(queryObj).skip(skip).limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_ALL_LANGUAGES'
      )({ message: 'LISTED|LANGUAGE', languages: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static createLanguage = async (req, res) => {
    try {
      const body = req.body

      const validation = await PresetValidator.createLanguage(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getLanguage(body)
      if (account && account.status) throw new BadRequestError('EXIST|LANGUAGE')

      const newLanguage = new Language({
        code: body.code,
        name: body.name
      })

      const language = await newLanguage.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_LANGUAGE'
      )({ message: 'CREATED|LANGUAGE', language: language })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateLanguage = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.languageId
      body.exceptId = userId

      const validation = await PresetValidator.createLanguage(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getLanguage(body)
      if (account || account.status) {
        // if(account.data.customer._id != mongoose.Types.ObjectId(userId))
        throw new BadRequestError('EXIST|LANGUAGE')
      }

      const language = await Language.findById(userId).exec()

      language.code = body.code || language.code
      language.name = body.name || language.name

      const updatedLanguage = await language.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_LANGUAGE'
      )({ message: 'UPDATED|LANGUAGE', language: updatedLanguage })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteLanguage = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.languageId
      body._id = userId

      const account = await PresetService.getLanguage(body)
      if (!account || !account.status) {
        throw new NotFoundError('NOT_EXIST|LANGUAGE')
      }
      const language = await Language.findById(userId).remove().exec()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_LANGUAGE'
      )({ message: 'DELETED|LANGUAGE', language: language })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getCountryExists = async (req, res) => {
    try {
      const query = req.query

      const validation = await PresetValidator.getCountryExists(query)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getCountry(query)
      if (account && account.status) throw new BadRequestError('EXIST|COUNTRY')

      return requestHandler.sendSuccess(req, res, 'GET_COUNTRY_EXISTS')({ message: 'NOT_EXIST|COUNTRY' })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  /* static async getAllCountry(req, res) {
    try {
      const queryData = req.query
      const paramData = req.params
      console.log("_______queryData",queryData);
      console.log("_______paramData",paramData);

      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObject = {}

      const queryBuilder = await QueryBuilder.getSearchable(Country, queryData)
      console.log("____________queryBuilder",queryBuilder);
      queryObject = queryBuilder.queryObject
      console.log("___________queryObject",queryObject);
      if (paramData.countryId) {
        queryObject._id = mongoose.Types.ObjectId(paramData.countryId)
      }

      const getDataCount = await Country.find(queryObject).count()
      const getData = await Country.find(queryObject).skip(skip).limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_ALL_COUNTRY'
      )({ message: 'LISTED|COUNTRY', countries: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  } */

  static async getAllCountry(req, res) {
    try {
      const queryData = req.query
      const paramData = req.params
      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObject = {}

      const { queryObject: queryBuilderObject } = await QueryBuilder.getSearchable(Country, queryData)
      queryObject = queryBuilderObject

      if (queryData.countryId || paramData.countryId) {
        const countryId = queryData.countryId || paramData.countryId
        queryObject._id = mongoose.Types.ObjectId(countryId)
      }
      const getDataCount = await Country.find(queryObject).countDocuments()
      const getData = await Country.find(queryObject).skip(skip).limit(perPage)

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_ALL_COUNTRY'
      )({ message: 'LISTED|COUNTRY', countries: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static async listAllCountries(req, res) {
    try {
      const queryData = req.query

      const queryObj = {}
      if (queryData.name) {
        queryObj.name = { $regex: queryData.name, $options: 'i' }
      }
      const getDataCount = await Country.find(queryObj).count()
      const getData = await Country.find(queryObj).exec()
      return requestHandler.sendSuccess(
        req,
        res,
        'LIST_ALL_COUNTRIES'
      )({ message: 'LISTED|COUNTRIES', countries: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static createCountry = async (req, res) => {
    try {
      const body = req.body

      const validation = await PresetValidator.createCountry(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getCountry(body)
      if (account && account.status) throw new BadRequestError('EXISTS')

      const newCountry = new Country({
        code: body.code,
        name: body.name,
        phonecode: body.phonecode
      })

      const country = await newCountry.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_COUNTRY'
      )({ message: 'CREATED|COUNTRY', country: country })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateCountry = async (req, res) => {
    try {
      const body = req.body
      const countryId = req.params.countryId
      body.exceptId = countryId

      const validation = await PresetValidator.updateCountry(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getCountry(body)
      if (account && account.status) {
        throw new BadRequestError('EXISTS')
      }
      const country = await Country.findById(countryId).exec()

      country.code = body.code || country.code
      country.name = body.name || country.name
      country.phonecode = body.phonecode || country.phonecode

      const updatedCountry = await country.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_COUNTRY'
      )({ message: 'UPDATED|COUNTRY', country: updatedCountry })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteCountry = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.countryId
      body._id = userId

      const account = await PresetService.getCountry(body)
      if (!account || !account.status) {
        throw new NotFoundError('NOT_EXISTS')
      }
      const country = await Country.findById(userId).remove().exec()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_COUNTRY'
      )({ message: 'DELETED|COUNTRY', country: country })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getStateExists = async (req, res) => {
    try {
      const query = req.query

      const validation = await PresetValidator.getStateExists(query)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getState(query)
      if (account && account.status) throw new BadRequestError('EXIST|STATE')

      return requestHandler.sendSuccess(req, res, 'GET_STATE_EXISTS')({ message: 'NOT_EXIST|STATE' })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static async getAllState(req, res) {
    try {
      const queryData = req.query
      const paramData = req.params

      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObject = {}

      const queryBuilder = await QueryBuilder.getSearchable(State, queryData)
      queryObject = queryBuilder.queryObject

      if (queryData.stateId || paramData.stateId) {
        const stateId = queryData.stateId || paramData.stateId
        queryObject._id = mongoose.Types.ObjectId(stateId)
      }

      if (queryData.countryId) {
        queryObject.country_id = mongoose.Types.ObjectId(queryData.countryId)
      }
      const getDataCount = await State.find(queryObject).count()
      const getData = await State.find(queryObject)
        .populate({ path: 'country_id', select: 'name' })
        .skip(skip)
        .limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_ALL_STATE'
      )({ message: 'LISTED|STATE', states: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static async listAllStates(req, res) {
    try {
      const queryData = req.query
      const paramData = req.params

      const queryObj = {}
      if (queryData.name) {
        queryObj.name = { $regex: queryData.name, $options: 'i' }
      }
      if (queryData.countryId) {
        queryObj.country_id = mongoose.Types.ObjectId(queryData.countryId)
      }
      if (paramData.countryId) {
        queryObj.country_id = mongoose.Types.ObjectId(paramData.countryId)
      }
      const getDataCount = await State.find(queryObj).count()
      const getData = await State.find(queryObj).exec()
      return requestHandler.sendSuccess(
        req,
        res,
        'LIST_ALL_STATE'
      )({ message: 'LISTED|STATE', states: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static createState = async (req, res) => {
    try {
      const body = req.body

      const validation = await PresetValidator.createState(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getState(body)
      if (account && account.status) throw new BadRequestError('EXIST|STATE')

      const newState = new State({
        name: body.name,
        code: body.code,
        country_id: body.country_id
      })

      const state = await newState.save()
      return requestHandler.sendSuccess(req, res, 'CREATE_STATE')({ message: 'CREATED|STATE', state: state })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateState = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.stateId
      body.exceptId = userId
      const validation = await PresetValidator.updateState(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getState(body)
      if (account && account.status) {
        // if(account.data.customer._id != mongoose.Types.ObjectId(userId))
        throw new BadRequestError('EXISTS')
      }

      const state = await State.findById(userId).exec()

      state.name = body.name || state.name
      state.code = body.code || state.code
      state.country_id = body.country_id || state.country_id

      const updatedState = await state.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_STATE'
      )({ message: 'UPDATED|STATE', state: updatedState })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteState = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.stateId
      body._id = userId

      const account = await PresetService.getState(body)
      if (!account && !account.status) {
        throw new NotFoundError('NOT_FOUND|STATE')
      }
      const state = await State.findById(userId).remove().exec()

      return requestHandler.sendSuccess(req, res, 'DELETE_STATE')({ message: 'DELETED|STATE', state: state })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getCityExists = async (req, res) => {
    try {
      const query = req.query

      const validation = await PresetValidator.getCityExists(query)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getCity(req.query)
      if (account && account.status) throw new BadRequestError('EXIST|CITY')

      return requestHandler.sendSuccess(req, res, 'GET_CITY_EXISTS')({ message: 'NOT_EXIST|CITY' })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static async getAllCity(req, res) {
    try {
      const queryData = req.query
      const paramData = req.params

      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObject = {}

      const queryBuilder = await QueryBuilder.getSearchable(City, queryData)
      queryObject = queryBuilder.queryObject

      if (queryData.cityId || paramData.cityId) {
        const cityId = queryData.cityId || paramData.cityId
        queryObject._id = mongoose.Types.ObjectId(cityId)
      }
      const getDataCount = await City.find(queryObject).count()
      const getData = await City.find(queryObject)
        .populate('country_id', 'name')
        .populate('state_id', 'name')
        .skip(skip)
        .limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_ALL_CITIES'
      )({ message: 'SUCCESS', cities: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static async listAllCities(req, res) {
    try {
      const queryData = req.query
      const paramData = req.params

      const queryObj = {}
      if (queryData.name) {
        queryObj.name = { $regex: queryData.name, $options: 'i' }
      }
      if (queryData.countryId) {
        queryObj.country_id = mongoose.Types.ObjectId(queryData.countryId)
      }
      if (queryData.stateId) {
        queryObj.state_id = mongoose.Types.ObjectId(queryData.stateId)
      }
      if (paramData.countryId) {
        queryObj.country_id = mongoose.Types.ObjectId(paramData.countryId)
      }
      if (paramData.stateId) {
        queryObj.state_id = mongoose.Types.ObjectId(paramData.stateId)
      }
      const getDataCount = await City.find(queryObj).count()
      const getData = await City.find(queryObj).exec()
      return requestHandler.sendSuccess(
        req,
        res,
        'LIST_ALL_CITIES'
      )({ message: 'LISTED|CITIES', cities: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static createCity = async (req, res) => {
    try {
      const body = req.body

      const validation = await PresetValidator.createCity(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getCity(body)
      if (account && account.status) throw new BadRequestError('EXISTS')

      const newCity = new City({
        name: body.name,
        code: body.code,
        country_id: body.country_id,
        state_id: body.state_id
        // location: body.location
      })

      const city = await newCity.save()
      return requestHandler.sendSuccess(req, res, 'CREATE_CITY')({ message: 'CREATED|CITY', city: city })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateCity = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.cityId
      body.exceptId = userId

      const validation = await PresetValidator.updateCity(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getCity(body)
      if (account?.status) {
        // if(account.data.customer._id != mongoose.Types.ObjectId(userId))
        throw new BadRequestError('EXIST|CITY')
      }

      const city = await City.findById(userId).exec()

      city.name = body.name || city.name
      city.code = body.code || city.code
      city.country_id = body.country_id || city.country_id
      city.state_id = body.state_id || city.state_id
      // city.location = body.location || city.location
      const updatedCity = await city.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_CITY'
      )({ message: 'UPDATED|CITY', city: updatedCity })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteCity = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.cityId
      body._id = userId

      const account = await PresetService.getCity(body)
      if (!account || !account.status) {
        throw new NotFoundError('NOT_EXIST|CITY')
      }
      const city = await City.findById(userId).remove().exec()

      return requestHandler.sendSuccess(req, res, 'DELETE_CITY')({ message: 'DELETED|CITY', city: city })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getModelExists = async (req, res) => {
    try {
      const query = req.query

      const validation = await PresetValidator.getModelExists(query)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getModel(req.query)
      if (account && !account.status) throw new BadRequestError('EXIST|MODEL')

      return requestHandler.sendSuccess(req, res, 'GET_MODEL_EXISTS')({ message: 'NOT_FOUND|MODEL' })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static async getAllModel(req, res) {
    try {
      const queryData = req.query
      const paramData = req.params

      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObject = {}

      const queryBuilder = await QueryBuilder.getSearchable(Model, queryData)
      queryObject = queryBuilder.queryObject

      if (paramData.modelId) {
        queryObject._id = mongoose.Types.ObjectId(paramData.modelId)
      }
      const getDataCount = await Model.find(queryObject).count()
      const getData = await Model.find(queryObject).skip(skip).limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_ALL_MODELS'
      )({ message: 'LISTED|MODELS', models: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static async listAllModels(req, res) {
    try {
      const queryData = req.query
      const paramData = req.params

      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      const queryObj = {}
      if (queryData.name) {
        queryObj.name = { $regex: queryData.name, $options: 'i' }
      }
      if (paramData.makeId) {
        queryObj.make_id = mongoose.Types.ObjectId(paramData.makeId)
      }
      const listModels = await Model.find(queryObj).skip(skip).limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'LIST_ALL_MODELS'
      )({ message: 'LISTED|MODEL', models: listModels })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static createModel = async (req, res) => {
    try {
      const body = req.body

      const validation = await PresetValidator.createModel(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getModel(body)
      if (account && account.status) throw new BadRequestError('EXISTS')

      const newModel = new Model({
        name: body.name,
        year: body.year,
        make_id: body.make_id
      })

      const model = await newModel.save()
      return requestHandler.sendSuccess(req, res, 'CREATE_MODEL')({ message: 'CREATED|MODEL', model: model })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateModel = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.modelId
      body.exceptId = userId

      const validation = await PresetValidator.updateModel(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getModel(body)
      if (account && account.status) {
        // if(account.data.customer._id != mongoose.Types.ObjectId(userId))
        throw new BadRequestError('EXISTS')
      }

      const model = await Model.findById(userId).exec()

      model.name = body.name || model.name
      model.year = body.year || model.year
      model.make_id = body.make_id || model.make_id

      const updatedModel = await model.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_MODEL'
      )({ message: 'UPDATED|MODEL', model: updatedModel })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteModel = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.modelId
      body._id = userId

      const account = await PresetService.getModel(body)
      if (!account && !account.status) {
        throw new NotFoundError('NOT_EXISTS')
      }
      const model = await Model.findById(userId).remove().exec()

      return requestHandler.sendSuccess(req, res, 'DELETE_MODEL')({ message: 'DELETED|MODEL', model: model })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getMakeExists = async (req, res) => {
    try {
      const query = req.query

      const validation = await PresetValidator.getMakeExists(query)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getMake(req.query)
      if (account && account.status) throw new BadRequestError('EXIST|MAKE')

      return requestHandler.sendSuccess(req, res, 'GET_MAKE_EXISTS')({ message: 'NOT_FOUND|MAKE' })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static async getAllMake(req, res) {
    try {
      const queryData = req.query
      const paramData = req.params

      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObject = {}

      const queryBuilder = await QueryBuilder.getSearchable(Make, queryData)
      queryObject = queryBuilder.queryObject

      if (paramData.makeId) {
        queryObject._id = mongoose.Types.ObjectId(paramData.makeId)
      }
      const getDataCount = await Make.find(queryObject).count()
      const getData = await Make.find(queryObject).skip(skip).limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_ALL_MAKE'
      )({ message: 'LISTED|MAKES', makes: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static async listAllMakes(req, res) {
    try {
      const queryData = req.query

      const queryObj = {}
      if (queryData.name) {
        queryObj.name = { $regex: queryData.name, $options: 'i' }
      }
      const listMakes = await Make.find(queryObj).lean().exec()
      return requestHandler.sendSuccess(
        req,
        res,
        'LIST_ALL_MAKE'
      )({ message: 'LISTED|MAKE', makes: listMakes })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static createMake = async (req, res) => {
    try {
      const body = req.body

      const validation = await PresetValidator.createMake(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getMake(body)
      if (account && account.status) throw new BadRequestError('EXISTS')

      const newMake = new Make({
        name: body.name
      })

      const make = await newMake.save()
      return requestHandler.sendSuccess(req, res, 'CREATE_MAKE')({ message: 'CREATED|MAKE', make: make })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateMake = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.makeId
      body.exceptId = userId

      const validation = await PresetValidator.updateMake(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const account = await PresetService.getMake(body)
      if (account && account.status) {
        // if(account.data.customer._id != mongoose.Types.ObjectId(userId))
        throw new BadRequestError('EXIST|MAKE')
      }

      const make = await Make.findById(userId).exec()

      make.name = body.name || make.name

      const updatedMake = await make.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_MAKE'
      )({ message: 'UPDATED|MAKE', make: updatedMake })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteMake = async (req, res) => {
    try {
      const body = req.body
      const userId = req.params.makeId
      body._id = userId

      const account = await PresetService.getMake(body)
      if (!account || !account.status) {
        throw new NotFoundError('NOT_FOUND|MAKE')
      }
      const make = await Make.findById(userId).remove().exec()

      return requestHandler.sendSuccess(req, res, 'DELETE_MAKE')({ message: 'DELETED|MAKE', make: make })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static async getCurrency(req, res) {
    try {
      const queryData = req.query
      const paramData = req.params

      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0

      let queryObject = {}
      const queryBuilder = await QueryBuilder.getSearchable(Currency, queryData)
      queryObject = queryBuilder.queryObject
      queryObject['deletedAt'] = null

      if (paramData.currencyId || queryData.currencyId) {
        const currencyId = paramData.currencyId || queryData.currencyId
        queryObject._id = mongoose.Types.ObjectId(currencyId)
      }
      const getDataCount = await Currency.find(queryObject).count()
      const getData = await Currency.find(queryObject).skip(skip).limit(perPage).populate('country', 'name')
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_CURRENCY'
      )({ message: 'PROVIDED|CURRENCY DATA', currency: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static async listCurrency(req, res) {
    try {
      const queryData = req.query

      let queryObject = {}
      const queryBuilder = await QueryBuilder.getSearchable(Currency, queryData)
      queryObject = queryBuilder.queryObject
      queryObject['deletedAt'] = null

      const listCurrency = await Currency.find(queryObject).lean().exec()
      return requestHandler.sendSuccess(
        req,
        res,
        'LIST_CURRENCY'
      )({ message: 'LISTED|CURRENCY', currency: listCurrency })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static createCurrency = async (req, res) => {
    try {
      const body = req.body

      const validation = await PresetValidator.createCurrency(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const exists = await PresetService.getCurrency(body)
      if (exists && exists.status) throw new BadRequestError('EXISTS|CURRENCY')

      const newCurrency = new Currency({
        country: body.country,
        name: body.name,
        code: body.code,
        symbol: body.symbol
      })

      const currency = await newCurrency.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_CURRENCY'
      )({ message: 'CREATED|CURRENCY', currency: currency })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateCurrency = async (req, res) => {
    try {
      const body = req.body
      const currencyId = req.params.currencyId
      body.exceptId = currencyId

      const validation = await PresetValidator.updateCurrency(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const exists = await PresetService.getCurrency(body)
      if (exists && exists.status) {
        throw new BadRequestError('EXIST|CURRENCY')
      }

      const currency = await Currency.findById(currencyId).exec()
      if (body.status == false && currency.isDefault)
        throw new BadRequestError('CANT_DEACTIVE_IS_DEFAULT_CURRENCY')
      if (body.status == currency.status) throw new BadRequestError('UPDATED|STATUS ALREADY')

      currency.country = body.country || currency.country
      currency.name = body.name || currency.name
      currency.code = body.code || currency.code
      currency.symbol = body.symbol || currency.symbol
      currency.status = body.status || currency.status

      const updatedCurrency = await currency.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_CURRENCY'
      )({ message: 'UPDATED|CURRENCY', currency: updatedCurrency })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteCurrency = async (req, res) => {
    try {
      const body = req.body
      const currencyId = req.params.currencyId
      body._id = currencyId

      const exists = await PresetService.getCurrency(body)
      if (!exists || !exists.status) {
        throw new NotFoundError('NOT_FOUND|CURRENCY')
      }
      const currency = await Currency.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(currencyId), deletedAt: null },
        { deletedAt: new Date() },
        { new: true }
      ).exec()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_CURRENCY'
      )({ message: 'DELETED|CURRENCY', currency: currency })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }
  // Get all vechicle

  static getVehicleColor = async (req, res) => {
    try {
      const queryData = req.query
      const paramData = req.params
      const perPage = parseInt(queryData.limit) || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0
      // const auth = req.auth
      const orCond = []

      let queryObject = {}

      const queryBuilder = await QueryBuilder.getSearchable(VehicleColor, queryData)
      queryObject = queryBuilder.queryObject || queryObject
      queryObject['deletedAt'] = null
      // queryObject['ownerId'] = auth.userId
      if (paramData.vehicleColorId) {
        orCond.push(
          { _id: mongoose.Types.ObjectId(paramData.vehicleColorId) }
          // { ownerId: mongoose.Types.ObjectId(auth.userId) }
        )
        queryObject['$or'] = orCond
      }
      const getDataCount = await VehicleColor.find(queryObject).count()

      const pipeline = [{ $match: queryObject }]
      const getData = await VehicleColor.aggregate(pipeline).sort({ _id: -1 }).skip(skip).limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_VEHICLE_COLOR'
      )({ message: 'LISTED|COLORS', VehicleColor: getData, total: getDataCount })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }

  static createVehicleColor = async (req, res) => {
    try {
      const body = req.body
      const auth = req.auth

      const color = req.body.color || null
      if (!color) throw new BadRequestError('REQUIRED|COLOR')

      const validation = await PresetValidator.createVehicleColor(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const checkData = await VehicleColor.findOne({ color: body.color }).lean().exec()
      if (checkData) throw new BadRequestError('VEHICLE_COLOR_ALREADY_EXIST')

      const ownerId = auth.userId
      const ownerType = auth.role

      const newDoc = new VehicleColor({
        ownerId: ownerId,
        ownerType: ownerType,
        color: body.color
      })

      const createVehicleColor = await newDoc.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_VEHICLE_COLOR'
      )({ message: 'CREATED|VEHICLE_COLOR', Vehicle: createVehicleColor })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }

  static updateVehicleColor = async (req, res) => {
    try {
      const body = req.body
      const auth = req.auth
      const validation = await PresetValidator.updateVehicleColor(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const vehicleColorId = req.params.vehicleColorId

      const checkData = await VehicleColor.findOne({
        _id: { $ne: mongoose.Types.ObjectId(vehicleColorId) },
        color: req.body.color
      })
        .lean()
        .exec()
      if (checkData) throw new BadRequestError('VEHICLE_COLOR_ALREADY_EXISTS')

      const vechicleColorData = await VehicleColor.findOne({ _id: mongoose.Types.ObjectId(vehicleColorId) })
      if (!vechicleColorData) throw new NotFoundError('NOT_FOUND|VEHICLE_COLOR')

      let ownerId
      let ownerType
      if (auth.role == Enum.ROLES.ADMIN) {
        ownerId = req.auth.ownerId
        ownerType = req.auth.role
      }
      vechicleColorData.ownerId = ownerId || vechicleColorData.ownerId
      vechicleColorData.ownerType = ownerType || vechicleColorData.ownerType

      vechicleColorData.color = body.color || vechicleColorData.color

      vechicleColorData.updatedBy.userId = req.auth.userId || vechicleColorData.updatedBy.userId
      vechicleColorData.updatedBy.role = req.auth.role || vechicleColorData.updatedBy.role
      const vechicleColorDataUpdated = await vechicleColorData.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_VEHICLE_COLOR'
      )({ message: 'UPDATED|VEHICLE_COLOR', vechicleColorData: vechicleColorDataUpdated })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }

  static deleteVehicleColor = async (req, res) => {
    try {
      const vechicleColorData = await VehicleColor.findOne({
        _id: mongoose.Types.ObjectId(req.params.vehicleColorId)
      })
      if (!vechicleColorData) throw new NotFoundError('NOT_FOUND|VEHICLE COLOR')

      vechicleColorData.deletedAt = new Date()
      const vechicleColorDataUpdated = await vechicleColorData.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_VEHICLE_COLOR'
      )({ message: 'DELETED|VEHICLE_COLOR', vechicleColorData: vechicleColorDataUpdated })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  static getManufactureYear = async (req, res) => {
    try {
      const queryData = req.query
      const paramData = req.params
      const perPage = parseInt(queryData.limit) || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0
      // const auth = req.auth
      const orCond = []

      let queryObject = {}

      const queryBuilder = await QueryBuilder.getSearchable(ManufactureYear, queryData)
      queryObject = queryBuilder.queryObject || queryObject
      queryObject['deletedAt'] = null
      // queryObject['ownerId'] = auth.userId
      if (paramData.manufactureYearId) {
        orCond.push(
          { _id: mongoose.Types.ObjectId(paramData.manufactureYearId) }
          // { ownerId: mongoose.Types.ObjectId(auth.userId) }
        )
        queryObject['$or'] = orCond
      }
      const getDataCount = await ManufactureYear.find(queryObject).count()

      const pipeline = [{ $match: queryObject }]
      const getData = await ManufactureYear.aggregate(pipeline).sort({ _id: -1 }).skip(skip).limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_MANUFACTURE_YEAR'
      )({ message: 'SUCCESS', ManufactureYear: getData, total: getDataCount })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }

  static createManufactureYear = async (req, res) => {
    try {
      const body = req.body
      const auth = req.auth

      const year = req.body.year || null
      if (!year) throw new BadRequestError('REQUIRED|YEAR')

      const validation = await PresetValidator.createManufactureYear(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const checkData = await ManufactureYear.findOne({ year: body.year }).lean().exec()
      if (checkData) throw new BadRequestError('MANUFACTURE_YEAR_ALREADY_EXISTS')

      const ownerId = auth.userId
      const ownerType = auth.role

      const newDoc = new ManufactureYear({
        ownerId: ownerId,
        ownerType: ownerType,
        year: body.year
      })

      const createManufactureYear = await newDoc.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_MANUFACTURE_YEAR'
      )({ message: 'CREATED|MANUFACTURE YEAR', Year: createManufactureYear })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }

  static updateManufactureYear = async (req, res) => {
    try {
      const body = req.body
      const auth = req.auth
      const validation = await PresetValidator.updateManufactureYear(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const manufactureYearId = req.params.manufactureYearId

      const checkData = await ManufactureYear.findOne({
        _id: { $ne: mongoose.Types.ObjectId(manufactureYearId) },
        year: req.body.year
      })
        .lean()
        .exec()
      if (checkData) throw new BadRequestError('MANUFACTURE_YEAR_ALREADY_EXISTS')

      const manufactureYearData = await ManufactureYear.findOne({
        _id: mongoose.Types.ObjectId(manufactureYearId)
      })
      if (!manufactureYearData) throw new NotFoundError('NOT_FOUND|MANUFACTURE YEAR')

      let ownerId
      let ownerType
      if (auth.role == Enum.ROLES.ADMIN) {
        ownerId = req.auth.ownerId
        ownerType = req.auth.role
      }
      manufactureYearData.ownerId = ownerId || manufactureYearData.ownerId
      manufactureYearData.ownerType = ownerType || manufactureYearData.ownerType

      manufactureYearData.year = body.year || manufactureYearData.year

      manufactureYearData.updatedBy.userId = req.auth.userId || manufactureYearData.updatedBy.userId
      manufactureYearData.updatedBy.role = req.auth.role || manufactureYearData.updatedBy.role
      const manufactureYearDataUpdated = await manufactureYearData.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_MANUFACTURE_YEAR'
      )({ message: 'UPDATED|MANUFACTURE YEAR', manufactureYearData: manufactureYearDataUpdated })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }

  static deleteManufactureYear = async (req, res) => {
    try {
      const manufactureYearData = await ManufactureYear.findOne({
        _id: mongoose.Types.ObjectId(req.params.manufactureYearId)
      })
      if (!manufactureYearData) throw new NotFoundError('NOT_FOUND|MANUFACTURE YEAR')

      manufactureYearData.deletedAt = new Date()
      const manufactureYearDataUpdated = await manufactureYearData.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_MANUFACTURE_YEAR'
      )({ message: 'DELETED|MANUFACTURE YEAR', manufactureYearData: manufactureYearDataUpdated })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  // Dynamic Page Setting
  static getPage = async (req, res) => {
    try {
      const pageName = req.params.page
      const moduleData = await Setting.findOne({ page: pageName })

      return requestHandler.sendSuccess(req, res, 'PAGE')({ message: 'LISTED|PAGE', modules: moduleData })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updatePage = async (req, res) => {
    const pageName = req.params.page
    const content = req.body.content

    if (!content) throw new BadRequestError('REQUIRED|CONTENT')
    try {
      const result = await Setting.updateOne({ page: pageName }, { $set: { content } }, { upsert: true })
      console.log(result, 'result')
      return requestHandler.sendSuccess(req, res, 'UPDATED')({ message: 'UPDATED|PAGE' })
    } catch (err) {
      return requestHandler.sendError(req, res, Error)
    }
  }

  // Faq Category

  static createFaqCategory = async (req, res) => {
    try {
      // const auth = req.auth

      const body = req.body
      const validation = await PresetValidator.createFaqCategory(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const checkData = await FaqCategory.findOne({ category: body.category }).lean().exec()
      if (checkData) throw new BadRequestError('CATEGORY_ALREADY_EXISTS')

      const newFaqCategory = new FaqCategory({
        category: body.category,
        display_order: body.display_order,
        status: body.status
      })

      const createFaqCategory = await newFaqCategory.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_FAQ_CATEGORY'
      )({ message: 'CREATED|FAQ CATEGORY', FaqCategory: createFaqCategory })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  static getFaqCategory = async (req, res) => {
    try {
      const queryData = req.query
      const paramData = req.params
      const perPage = parseInt(queryData.limit) || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0
      // const auth = req.auth
      const orCond = []

      let queryObject = {}

      const queryBuilder = await QueryBuilder.getSearchable(FaqCategory, queryData)
      queryObject = queryBuilder.queryObject || queryObject
      queryObject['deletedAt'] = null
      if (paramData.faqCategoryId) {
        orCond.push({ _id: mongoose.Types.ObjectId(paramData.faqCategoryId) })
        queryObject['$or'] = orCond
      }
      const getDataCount = await FaqCategory.find(queryObject).count()

      const pipeline = [{ $match: queryObject }]
      const getData = await FaqCategory.aggregate(pipeline).sort({ _id: -1 }).skip(skip).limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_FAQ_CATEGORY'
      )({ message: 'LISTED|FAQ CATEGORY', FaqCategory: getData, total: getDataCount })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  static updateFaqCategory = async (req, res) => {
    try {
      const body = req.body
      const validation = await PresetValidator.updateFaqCategory(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const faqCategoryId = req.params.faqCategoryId

      const checkData = await FaqCategory.findOne({
        _id: { $ne: mongoose.Types.ObjectId(faqCategoryId) },
        category: req.body.category,
        display_order: req.body.display_order,
        status: req.body.status
      })
        .lean()
        .exec()
      if (checkData) throw new BadRequestError('FAQ_CATEGORY_ALREADY_EXISTS')

      const faqCategoryData = await FaqCategory.findOne({ _id: mongoose.Types.ObjectId(faqCategoryId) })
      if (!faqCategoryData) throw new NotFoundError('NOT_FOUND|FAQ_CATEGORY')
      faqCategoryData.category = body.category || faqCategoryData.category
      faqCategoryData.display_order = body.display_order || faqCategoryData.display_order
      faqCategoryData.status = body.status || faqCategoryData.status
      const faqCategoryDataUpdated = await faqCategoryData.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_FAQ_CATEGORY'
      )({ message: 'UPDATED|FAQ_CATEGORY', faqCategoryData: faqCategoryDataUpdated })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  static deleteFaqCategory = async (req, res) => {
    try {
      const faqCategoryData = await FaqCategory.findOne({
        _id: mongoose.Types.ObjectId(req.params.faqCategoryId)
      })
      if (!faqCategoryData) throw new NotFoundError('NOT_FOUND|FAQ CATEGORY')

      faqCategoryData.deletedAt = new Date()
      const faqCategoryDataUpdated = await faqCategoryData.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_FAQ_CATEGORY'
      )({ message: 'DELETED|FAQ_CATEGORY', faqCategoryData: faqCategoryDataUpdated })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }

  // FAQ
  static createFaq = async (req, res) => {
    try {
      // const auth = req.auth
      const body = req.body

      const validation = await PresetValidator.createFaq(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const newFaq = new Faq({
        category_id: body.category_id,
        display_order: body.display_order,
        question: body.question,
        answer: body.answer
      })

      const createFaq = await newFaq.save()

      return requestHandler.sendSuccess(req, res, 'CREATE_FAQ')({ message: 'CREATED|FAQ', Faq: createFaq })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  static getFaq = async (req, res) => {
    try {
      const queryData = req.query
      const paramData = req.params
      const perPage = parseInt(queryData.limit) || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0
      // const auth = req.auth
      const orCond = []

      let queryObject = {}

      const queryBuilder = await QueryBuilder.getSearchable(FaqCategory, queryData)
      queryObject = queryBuilder.queryObject || queryObject
      queryObject['deletedAt'] = null
      if (paramData.faqId) {
        orCond.push({ _id: mongoose.Types.ObjectId(paramData.faqId) })
        queryObject['$or'] = orCond
      }
      const getDataCount = await Faq.find(queryObject).count()

      const pipeline = [{ $match: queryObject }]
      const getData = await Faq.aggregate(pipeline).sort({ _id: -1 }).skip(skip).limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_FAQ'
      )({ message: 'SUCCESS', Faq: getData, total: getDataCount })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  static updateFaq = async (req, res) => {
    try {
      const body = req.body
      const validation = await PresetValidator.updateFaq(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const faqId = req.params.faqId

      const checkData = await Faq.findOne({
        _id: { $ne: mongoose.Types.ObjectId(faqId) },
        category_id: req.body.category_id,
        display_order: req.body.display_order,
        question: req.body.question,
        answer: req.body.answer
      })
        .lean()
        .exec()
      if (checkData) throw new BadRequestError('FAQ_ALREADY_EXISTS')

      const faqData = await Faq.findOne({ _id: mongoose.Types.ObjectId(faqId) })
      if (!faqData) throw new NotFoundError('NOT_FOUND|FAQ')
      faqData.category_id = body.category_id || faqData.category_id
      faqData.display_order = body.display_order || faqData.display_order
      faqData.question = body.question || faqData.question
      faqData.answer = body.answer || faqData.answer
      const faqDataUpdated = await faqData.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_FAQ'
      )({ message: 'UPDATED|FAQ', faqData: faqDataUpdated })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  static deleteFaq = async (req, res) => {
    try {
      const faqData = await Faq.findOne({ _id: mongoose.Types.ObjectId(req.params.faqId) })
      if (!faqData) throw new NotFoundError('NOT_FOUND|FAQ')

      faqData.deletedAt = new Date()
      const faqDataUpdated = await faqData.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_FAQ'
      )({ message: 'DELETED|FAQ', faqData: faqDataUpdated })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  // Help Category

  static createHelpCategory = async (req, res) => {
    try {
      // const auth = req.auth
      const body = req.body
      const validation = await PresetValidator.createHelpCategory(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const checkData = await HelpCategory.findOne({ category: body.category }).lean().exec()
      if (checkData) throw new BadRequestError('CATEGORY_ALREADY_EXISTS')

      const newHelpCategory = new HelpCategory({
        category: body.category,
        display_order: body.display_order,
        status: body.status
      })

      const createHelpCategory = await newHelpCategory.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_HELP_CATEGORY'
      )({ message: 'CREATED|HELP CATEGORY', HelpCategory: createHelpCategory })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  static getHelpCategory = async (req, res) => {
    try {
      const queryData = req.query
      const paramData = req.params
      const perPage = parseInt(queryData.limit) || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0
      // const auth = req.auth
      const orCond = []

      let queryObject = {}

      const queryBuilder = await QueryBuilder.getSearchable(HelpCategory, queryData)
      queryObject = queryBuilder.queryObject || queryObject
      queryObject['deletedAt'] = null
      if (paramData.helpCategoryId) {
        orCond.push({ _id: mongoose.Types.ObjectId(paramData.helpCategoryId) })
        queryObject['$or'] = orCond
      }
      const getDataCount = await HelpCategory.find(queryObject).count()

      const pipeline = [{ $match: queryObject }]
      const getData = await HelpCategory.aggregate(pipeline).sort({ _id: -1 }).skip(skip).limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_HELP_CATEGORY'
      )({ message: 'LISTED|HELP CATEGORY', HelpCategory: getData, total: getDataCount })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  static updateHelpCategory = async (req, res) => {
    try {
      const body = req.body
      const validation = await PresetValidator.updateHelpCategory(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const helpCategoryId = req.params.helpCategoryId

      const checkData = await HelpCategory.findOne({
        _id: { $ne: mongoose.Types.ObjectId(helpCategoryId) },
        category: req.body.category,
        display_order: req.body.display_order,
        status: req.body.status
      })
        .lean()
        .exec()
      if (checkData) throw new BadRequestError('HELP_CATEGORY_ALREADY_EXISTS')

      const helpCategoryData = await HelpCategory.findOne({ _id: mongoose.Types.ObjectId(helpCategoryId) })
      if (!helpCategoryData) throw new NotFoundError('NOT_FOUND|HELP CATEGORY')
      helpCategoryData.category = body.category || helpCategoryData.category
      helpCategoryData.display_order = body.display_order || helpCategoryData.display_order
      helpCategoryData.status = body.status || helpCategoryData.status
      const helpCategoryDataUpdated = await helpCategoryData.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_HELP_CATEGORY'
      )({ message: 'UPDATED|HELP CATEGORY', helpCategoryData: helpCategoryDataUpdated })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  static deleteHelpCategory = async (req, res) => {
    try {
      const helpCategoryData = await HelpCategory.findOne({
        _id: mongoose.Types.ObjectId(req.params.helpCategoryId)
      })
      if (!helpCategoryData) throw new NotFoundError('NOT_FOUND|HELP CATEGORY')

      helpCategoryData.deletedAt = new Date()
      const helpCategoryDataUpdated = await helpCategoryData.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_HELP_CATEGORY'
      )({ message: 'DELETED|HELP_CATEGORY', helpCategoryData: helpCategoryDataUpdated })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  // HELP TOPIC
  static createHelpTopic = async (req, res) => {
    try {
      // const auth = req.auth
      const body = req.body

      const validation = await PresetValidator.createHelpTopic(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)

      const newHelpTopic = new HelpTopic({
        category_id: body.category_id,
        display_order: body.display_order,
        question: body.question,
        answer: body.answer
      })

      const createHelpTopic = await newHelpTopic.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'CREATE_HELP_TOPIC'
      )({ message: 'CREATED|HELP TOPIC', HelpTopic: createHelpTopic })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  static getHelpTopic = async (req, res) => {
    try {
      const queryData = req.query
      const paramData = req.params
      const perPage = parseInt(queryData.limit) || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0
      // const auth = req.auth
      const orCond = []

      let queryObject = {}

      const queryBuilder = await QueryBuilder.getSearchable(FaqCategory, queryData)
      queryObject = queryBuilder.queryObject || queryObject
      queryObject['deletedAt'] = null
      if (paramData.helpTopicId) {
        orCond.push({ _id: mongoose.Types.ObjectId(paramData.helpTopicId) })
        queryObject['$or'] = orCond
      }
      const getDataCount = await HelpTopic.find(queryObject).count()

      const pipeline = [{ $match: queryObject }]
      const getData = await HelpTopic.aggregate(pipeline).sort({ _id: -1 }).skip(skip).limit(perPage)
      return requestHandler.sendSuccess(
        req,
        res,
        'GET_HELP_TOPIC'
      )({ message: 'LISTED|HELP TOPIC', HelpTopic: getData, total: getDataCount })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  static updateHelpTopic = async (req, res) => {
    try {
      const body = req.body
      const validation = await PresetValidator.updateHelpTopic(body)
      if (!validation.status) throw new UnprocessableError('Validation Failed', validation.data.validate)
      const helpTopicId = req.params.helpTopicId

      const checkData = await HelpTopic.findOne({
        _id: { $ne: mongoose.Types.ObjectId(helpTopicId) },
        category_id: req.body.category_id,
        display_order: req.body.display_order,
        question: req.body.question,
        answer: req.body.answer
      })
        .lean()
        .exec()
      if (checkData) throw new BadRequestError('FAQ_ALREADY_EXISTS')

      const helpTopicData = await HelpTopic.findOne({ _id: mongoose.Types.ObjectId(helpTopicId) })
      if (!helpTopicData) throw new NotFoundError('NOT_FOUND|FAQ')
      helpTopicData.category_id = body.category_id || helpTopicData.category_id
      helpTopicData.display_order = body.display_order || helpTopicData.display_order
      helpTopicData.question = body.question || helpTopicData.question
      helpTopicData.answer = body.answer || helpTopicData.answer
      const helpTopicDataUpdated = await helpTopicData.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_HELP_TOPIC'
      )({ message: 'UPDATED|HELP TOPIC', helpTopicData: helpTopicDataUpdated })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  static deleteHelpTopic = async (req, res) => {
    try {
      const helpTopicData = await HelpTopic.findOne({ _id: mongoose.Types.ObjectId(req.params.helpTopicId) })
      if (!helpTopicData) throw new NotFoundError('NOT_FOUND|HELP TOPIC')

      helpTopicData.deletedAt = new Date()
      const helpTopicDataUpdated = await helpTopicData.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_HELP_TOPIC'
      )({ message: 'DELETED|HELP TOPIC', helpTopicData: helpTopicDataUpdated })
    } catch (Error) {
      return requestHandler.sendError(req, res, Error)
    }
  }
  // Seo Setting

  static createSeoSetting = async (req, res) => {
    try {
      const body = req.body

      // Validate the request body
      if (!body || !body.keyword || !body.title || !body.description) {
        throw new BadRequestError('REQUIRED|ALL DETAILS')
      }

      // Create a new instance of SeoSetting
      const newData = new SeoSetting({
        keyword: body.keyword,
        title: body.title,
        description: body.description
      })

      await newData.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'CREATED_SEO_SETTING'
      )({ message: 'CREATED|SEO SETTING', seoSettingData: newData })
    } catch (error) {
      console.error('Error creating SEO setting:', error)

      return requestHandler.sendError(req, res, error)
    }
  }

  static getSeoSetting = async (req, res) => {
    try {
      const moduleData = await SeoSetting.find({})
      return requestHandler.sendSuccess(req, res, 'PAGE')({ message: 'LISTED|PAGE', modules: moduleData })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateSeoSetting = async (req, res) => {
    const keyword = req.body.keyword
    const title = req.body.title
    const description = req.body.description

    if (!keyword || !title || !description) throw new BadRequestError('REQUIRED|ALL FIELDS')
    try {
      const data = {
        title: req.body.title,
        keyword: req.body.keyword,
        description: req.body.description
      }

      const updatedSeoSetting = await SeoSetting.findOneAndUpdate({}, data, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      })
      console.log(updatedSeoSetting, 'updatedSeoSetting')
      return requestHandler.sendSuccess(req, res, 'UPDATED')({ message: 'UPDATED|SEO' })
    } catch (err) {
      return requestHandler.sendError(req, res, Error)
    }
  }

  static deleteSeoSetting = async (req, res) => {
    try {
      const id = req.params.seoSettingId
      const data = await SeoSetting.findById(id).remove().exec()
      return requestHandler.sendSuccess(
        req,
        res,
        'DELETED|SEO SETTING'
      )({ message: 'DELETED|SEO SETTING', deletedData: data })
    } catch (err) {
      return requestHandler.sendError(req, res, err)
    }
  }

  static createVehicleCategory = async (req, res) => {
    try {
      const body = req.body

      if (!body || !body.name) throw new BadRequestError('Name required')

      const newData = new VehicleCategory({
        name: body.name
      })
      if (req.file) newData.image = req.file.path
      await newData.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'CREATED_VEHILCLE_CATEGORY'
      )({ message: 'CREATED|VEHILCLE CATEGORY', vehicleCategory: newData })
    } catch (error) {
      return requestHandler.sendError(req, res, err)
    }
  }

  static updateVehicleCategory = async (req, res) => {
    try {
      const body = req.body
      const vehicleCategoryId = req.params.vehicleCategoryId

      const account = await VehicleCategory.findById(vehicleCategoryId).exec()
      if (!account && !account.status) throw new NotFoundError('NOT_EXIST|VEHICLE CATEGORY')

      const vehiclecategory = await VehicleCategory.findById(vehicleCategoryId).exec()

      vehiclecategory.name = body.name || vehiclecategory.name

      if (req.file) vehiclecategory.image = req.file.path
      const updatedVehicleCategory = await vehiclecategory.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_VEHICLE_CATEGORY'
      )({ message: 'UPDATED|VEHICLE CATEGORY', vehicleCategory: updatedVehicleCategory })
    } catch (error) {
      return requestHandler.sendError(req, res, err)
    }
  }

  static getVehicleCategory = async (req, res) => {
    try {
      const queryData = req.query
      const paramData = req.params
      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0
      const queryObject = {}

      if (paramData.vehicleCategoryId) {
        queryObject['_id'] = mongoose.Types.ObjectId(paramData.vehicleCategoryId)
      }

      const getDataCount = await VehicleCategory.find(queryObject).count()
      const getData = await VehicleCategory.find(queryObject).skip(skip).limit(perPage)

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_VEHICLE_CATEGORY'
      )({ message: 'LISTED|VEHICLE CATEGORY', vehicleCategory: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteVehicleCategory = async (req, res) => {
    try {
      const vehicleCategoryId = req.params.vehicleCategoryId

      const account = await VehicleCategory.findById(vehicleCategoryId).exec()
      if (!account && !account.status) throw new NotFoundError('NOT_EXIST|VEHICLE CATEGORY')
      const vehicleCategory = await VehicleCategory.findById(vehicleCategoryId).remove().exec()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_VEHICLE_CATEGORY'
      )({ message: 'DELETED|VEHICLE CATEGORY', vehicleCategory: vehicleCategory })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // CMS
  static createCms = async (req, res) => {
    try {
      const { type, title, content } = req.body
      const isExist = await Cms.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } })
      if (isExist) throw new BadRequestError('CMS|EXIST')

      const newDoc = new Cms({ type, title, content })
      await newDoc.save()

      return requestHandler.sendSuccess(req, res, 'CREATED_CMS')({ message: 'CREATED|CMS', cms: newDoc })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static getCms = async (req, res) => {
    try {
      const { cmsId } = req.params
      const queryData = req.query
      const perPage = Number(queryData.limit) || 10
      const page = Number(queryData.page) || 1
      const skip = page * perPage - perPage || 0
      const data = cmsId ? { _id: cmsId } : {}
      let cmsData

      if (queryData.type) {
        cmsData = await Cms.findOne({ type: queryData.type }).lean().exec()
        if (!cmsData) throw new BadRequestError('NOT_FOUND|CMS')
        return requestHandler.sendSuccess(req, res, 'GET_CMS')({ message: 'GET|CMS', cms: cmsData })
      }
      cmsData = await Cms.find(data).skip(skip).limit(perPage)
      if (!cmsData || !cmsData.length) throw new BadRequestError('NOT_FOUND|CMS')

      return requestHandler.sendSuccess(req, res, 'GET_CMS')({ message: 'GET|CMS', cms: cmsData })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateCms = async (req, res) => {
    try {
      const { cmsId } = req.params
      const { title, content } = req.body
      if (!cmsId) throw new BadRequestError('REQUIRED|CMSID')

      const isExist = await Cms.findById(cmsId)
      if (!isExist) throw new BadRequestError('NOT_FOUND|CMS')

      isExist.title = title || isExist.title
      isExist.content = content || isExist.content
      await isExist.save()

      return requestHandler.sendSuccess(req, res, 'UPDATE_CMS')({ message: 'UPDATE|CMS', cms: isExist })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteCms = async (req, res) => {
    try {
      const { cmsId } = req.params
      const deletedCms = await Cms.findByIdAndDelete(cmsId)
      if (!deletedCms) throw new BadRequestError('FAILED|DELETION')

      return requestHandler.sendSuccess(req, res, 'DELETE_CMS')({ message: 'DELETE|CMS', cms: deletedCms })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  // Privacypolicy
  static sendPrivacypolicy = (req, res) => {
    const filePath = path.join(__dirname, '../html/privacypolicy.html')
    fs.readFile(filePath, 'utf8', function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'LISTED|PRIVACY POLICY', Data: doc })
    })
  }

  static updatePrivacypolicy = (req, res) => {
    const filePath = path.join(__dirname, '../html/privacypolicy.html')
    fs.writeFile(filePath, req.body.data, function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'UPDATED|PRIVACYPOLICY' })
    })
  }

  // Terms and conditions

  static sendTnc = (req, res) => {
    const filePath = path.join(__dirname, '../html/tnc.html')
    fs.readFile(filePath, 'utf8', function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'LISTED|TERMS AND CONDITION', Data: doc })
    })
  }

  static updateTnc = (req, res) => {
    const filePath = path.join(__dirname, '../html/tnc.html')
    fs.writeFile(filePath, req.body.data, function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'UPDATED|TERMS AND CONDITION' })
    })
  }

  // Rider Terms and conditions

  static sendRiderTnc = (req, res) => {
    const filePath = path.join(__dirname, '../html/ridertnc.html')
    fs.readFile(filePath, 'utf8', function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'LISTED|TERMS AND CONDITION', Data: doc })
    })
  }

  static updateRiderTnc = (req, res) => {
    const filePath = path.join(__dirname, '../html/ridertnc.html')
    fs.writeFile(filePath, req.body.data, function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'UPDATED|TERMS AND CONDITION' })
    })
  }

  // About us

  static sendAboutus = (req, res) => {
    const filePath = path.join(__dirname, '../html/about.html')
    fs.readFile(filePath, 'utf8', function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'LISTED|ABOUT US', Data: doc })
    })
  }

  static updateAboutus = (req, res) => {
    const filePath = path.join(__dirname, '../html/about.html')
    fs.writeFile(filePath, req.body.data, function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'UPDATED|ABOUT US' })
    })
  }

  // Refund Policy
  static sendRefundPolicy = (req, res) => {
    const filePath = path.join(__dirname, '../html/refundpolicy.html')
    fs.readFile(filePath, 'utf8', function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'LISTED|REFUND POLICY', Data: doc })
    })
  }

  static updateRefundPolicy = (req, res) => {
    const filePath = path.join(__dirname, '../html/refundpolicy.html')
    fs.writeFile(filePath, req.body.data, function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'UPDATED|REFUND POLICY' })
    })
  }

  // cancellation Policy
  static sendCancellationPolicy = (req, res) => {
    const filePath = path.join(__dirname, '../html/cancellationpolicy.html')
    fs.readFile(filePath, 'utf8', function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'LISTED|CANCELLATION POLICY', Data: doc })
    })
  }

  static updateCancellationPolicy = (req, res) => {
    const filePath = path.join(__dirname, '../html/cancellationpolicy.html')
    fs.writeFile(filePath, req.body.data, function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'UPDATED|CANCELLATION POLICY' })
    })
  }

  // Safety Policy
  static sendSafetyPolicy = (req, res) => {
    const filePath = path.join(__dirname, '../html/safetypolicy.html')
    fs.readFile(filePath, 'utf8', function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'LISTED|SAFETY POLICY', Data: doc })
    })
  }

  static updateSafetyPolicy = (req, res) => {
    const filePath = path.join(__dirname, '../html/safetypolicy.html')
    fs.writeFile(filePath, req.body.data, function (err, doc) {
      if (err) {
        return requestHandler.sendError(req, res, err)
      }
      return requestHandler.sendSuccess(req, res)({ message: 'UPDATED|SAFETY POLICY' })
    })
  }

  static addParcelType = async (req, res) => {
    try {
      const body = req.body

      if (!body || !body.name) throw new BadRequestError('REQUIRED|NAME')

      const newData = new ParcelType({
        name: body.name
      })
      await newData.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'CREATED_PARCEL_TYPE'
      )({ message: 'CREATED|PARCEL TYPE', parcelType: newData })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateParcelType = async (req, res) => {
    try {
      const body = req.body
      const parcelTypeId = req.params.parcelTypeId

      const account = await ParcelType.findById(parcelTypeId).exec()
      if (!account) throw new NotFoundError('NOT_EXIST|PARCELTYPE')

      const parceltype = await ParcelType.findById(parcelTypeId).exec()

      parceltype.name = body.name || parceltype.name

      const updatedParcelType = await parceltype.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_VEHICLE_CATEGORY'
      )({ message: 'UPDATED|VEHICLE CATEGORY', parcelType: updatedParcelType })
    } catch (error) {
      return requestHandler.sendError(req, res, err)
    }
  }

  static getParcelType = async (req, res) => {
    try {
      const queryData = req.query
      const paramData = req.params
      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0
      const queryObject = {}

      if (paramData.parcelTypeId) {
        queryObject['_id'] = mongoose.Types.ObjectId(paramData.parcelTypeId)
      }

      const getDataCount = await ParcelType.find(queryObject).count()
      const getData = await ParcelType.find(queryObject, { _id: 1, name: 1, status: 1 })
        .skip(skip)
        .limit(perPage)

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_PARCELTYPE'
      )({ message: 'LISTED|PARCELTYPE', parcelType: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteParcelType = async (req, res) => {
    try {
      const parcelTypeId = req.params.parcelTypeId

      const account = await ParcelType.findById(parcelTypeId).exec()
      if (!account) throw new NotFoundError('NOT_EXIST|PARCEL TYPE')
      const parcelType = await ParcelType.findById(parcelTypeId).remove().exec()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_PARCELTYPE'
      )({ message: 'DELETED|PARCELTYPE', parcelType: parcelType })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static addDeliverParcelType = async (req, res) => {
    try {
      const body = req.body

      if (!body || !body.name) throw new BadRequestError('REQUIRED|NAME')

      const newData = new DeliverParcelType({
        name: body.name
      })
      await newData.save()

      return requestHandler.sendSuccess(
        req,
        res,
        'CREATED_DELIVER_PARCELTYPE'
      )({ message: 'CREATED|DELIVER PARCELTYPE', deliverParcelType: newData })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static updateDeliverParcelType = async (req, res) => {
    try {
      const body = req.body
      const deliverParcelTypeId = req.params.deliverParcelTypeId

      const account = await DeliverParcelType.findById(deliverParcelTypeId).exec()
      if (!account) throw new NotFoundError('NOT_EXIST|DELIVER PARCELTYPE')

      const deliverParceltype = await DeliverParcelType.findById(deliverParcelTypeId).exec()

      deliverParceltype.name = body.name || deliverParceltype.name

      const updatedDeliverParcelType = await deliverParceltype.save()
      return requestHandler.sendSuccess(
        req,
        res,
        'UPDATE_DELIVER_PARCELTYPE'
      )({ message: 'UPDATED|DELIVER PARCELTYPE', deliverParcelType: updatedDeliverParcelType })
    } catch (error) {
      return requestHandler.sendError(req, res, err)
    }
  }

  static getDeliverParcelType = async (req, res) => {
    try {
      const queryData = req.query
      const paramData = req.params
      const perPage = queryData.limit || 10
      const page = queryData.page || 1
      const skip = perPage * page - perPage || 0
      const queryObject = {}

      if (paramData.deliverParcelTypeId) {
        queryObject['_id'] = mongoose.Types.ObjectId(paramData.deliverParcelTypeId)
      }

      const getDataCount = await DeliverParcelType.find(queryObject).count()
      const getData = await DeliverParcelType.find(queryObject, { _id: 1, name: 1, status: 1 })
        .skip(skip)
        .limit(perPage)

      return requestHandler.sendSuccess(
        req,
        res,
        'GET_DELIVER_PARCELTYPE'
      )({ message: 'LISTED|DELIVER PARCELTYPE', deliverParcelType: getData, total: getDataCount })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }

  static deleteDeliverParcelType = async (req, res) => {
    try {
      const deliverParcelTypeId = req.params.deliverParcelTypeId

      const account = await DeliverParcelType.findById(deliverParcelTypeId).exec()
      if (!account) throw new NotFoundError('NOT_EXIST|DELIVER PARCELTYPE')
      const deliverParcelType = await DeliverParcelType.findById(deliverParcelTypeId).remove().exec()

      return requestHandler.sendSuccess(
        req,
        res,
        'DELETE_DELIVER_PARCELTYPE'
      )({ message: 'DELETED|DELIVER PARCELTYPE', deliverParcelType: deliverParcelType })
    } catch (error) {
      return requestHandler.sendError(req, res, error)
    }
  }
}
export { PresetController }
